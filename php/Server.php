<?php
require_once('Validator.php');
require_once('HtmlPacker.php');
session_start();
if (!isset($_SESSION['points'])) {
    $_SESSION['points'] = array();
}
$start = microtime(true);

date_default_timezone_set('Europe/Moscow');

$jsonData = file_get_contents('php://input');
$postData = json_decode($jsonData, true);
if (isset($postData['x'], $postData['y'], $postData['r'])) {
    $x = $postData['x'];
    $y = $postData['y'];
    $r = $postData['r'];
    $between_minus_three_and_three = '/^-?(?:3(?:\.0+)?|[0-2](?:\.[0-9]+)?|\.[0-9]+)$/';
    try {

        if (!($x == -2 || $x == -1.5 || $x == -1 || $x == -0.5 || $x == 0 ||
            $x == 0.5 || $x == 1 || $x == 1.5 || $x == 2)) {

            throw new InvalidArgumentException("X isn't valid: $x");

        } else if (!preg_match($between_minus_three_and_three, $y)) {

            throw new InvalidArgumentException("Y isn't valid: $y");

        } else if (!($r == 1 || $r == 1.5 || $r == 2 || $r == 2.5 || $r == 3)) {

            throw new InvalidArgumentException("R isn't valid: $r");

        }

        $in_range = Validator::validate($x, $y, $r) ? "true" : "false";

        $point = array(
            'request_time' => round((microtime(true) - $start) * 1000, 3),
            'current_time' => date('Y/m/d H:i:s'),
            'in_range' => $in_range,
            'x' => $x,
            'y' => $y,
            'r' => $r
        );
        putPoint($point);
        sendData(HtmlPacker::sessionDataToHtml("tr", "td"));
    } catch (InvalidArgumentException $exception) {
        sendErrorMessage($exception->getMessage());
    }
} else if (isset($postData['delete'])) {
    $delete = $postData['delete'];

    if (strtolower($delete) === "true") {
        deletePointStorage();
        sendData("deleted");
    } else {
        sendErrorMessage("uncorrected data");
    }
} else {
    sendErrorMessage("uncorrected data");
}

function deletePointStorage()
{
    $_SESSION = [];
}

function putPoint($point)
{
    $_SESSION['points'][] = json_encode($point);
}


function sendErrorMessage($message): void
{
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $message]);
}

function sendData($message): void
{
    echo json_encode(['status' => 'success', 'message' => $message]);
}

