<?php

class HtmlPacker
{
    public static function sessionDataToHtml($outer_tag, $inner_tag): string
    {
        $html = "";
        foreach ($_SESSION['points'] as $item) {
            $object = json_decode($item);
            $html .= "<$outer_tag>";
            $html = $html . "<$inner_tag>" . $object->request_time . "</$inner_tag>";
            $html = $html . "<$inner_tag>" . $object->current_time . "</$inner_tag>";
            $html = $html . "<$inner_tag>" . $object->in_range . "</$inner_tag>";
            $html = $html . "<$inner_tag>" . $object->x . "</$inner_tag>";
            $html = $html . "<$inner_tag>" . $object->y . "</$inner_tag>";
            $html = $html . "<$inner_tag>" . $object->r . "</$inner_tag>";
            $html .= "</$outer_tag>";
        }
        return $html;
    }

}