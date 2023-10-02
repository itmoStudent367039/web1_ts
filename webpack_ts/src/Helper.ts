import Swal from "sweetalert2";
import $ from 'jquery';
import {InputValidator} from "./InputValidator";
import {TableWorker} from "./TableWorker";
import {Graph} from "./Graph";
import {HtmlParser} from "./HtmlParser";
import {CacheWorker} from "./CacheWorker";

const graph = new Graph();
const tableWorker = new TableWorker();
const inputValidator = new InputValidator();
const htmlParser = new HtmlParser();
const cacheWorker = new CacheWorker();

export async function clearTable() {
    await cacheWorker.clearCache();
    tableWorker.deleteAllRows();
    const radius: number | null = findAndReturnSelectedRadius();
    if (radius !== null) {
        graph.redrawAll(radius);
    }
}

export function addRadiusChangeListener(): void {
    const radius: number | null = findAndReturnSelectedRadius();
    if (radius !== null) {
        graph.redrawAll(radius);
    }
    drawAllPoints(graph);
}

function findAndReturnSelectedRadius(): number | null {
    const selectedElement = document.querySelector("input[name='R']:checked");
    if (selectedElement instanceof HTMLInputElement) {
        return +selectedElement.value;
    } else {
        return null;
    }
}

export async function addCheckButtonListener() {
    if (inputValidator.validateX() && inputValidator.validateY()) {
        try {
            const response = await fetch("php/Server.php", {
                method: "POST",
                body: JSON.stringify({
                    x: inputValidator.getX,
                    y: inputValidator.getY,
                    r: findAndReturnSelectedRadius(),
                }),
            });
            const data = await response.json();
            if (data?.status === "error") {
                await doAttention(data?.message);
                alert(data?.message);
            } else if (data?.status === "success") {
                await cacheWorker.putPoint(
                    htmlParser.parse(data?.message),
                    "./data.html",
                );
                tableWorker.innerData(data?.message);
                drawAllPoints(graph);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

function drawAllPoints(canvasPrinter: Graph): void {
    const data = tableWorker.getData();
    if (data) {
        for (let i = 0; i < data.length; i++) {
            canvasPrinter.drawPoint(
                data[i]?.x,
                data[i]?.y,
                (data[i]?.inRange?.toLowerCase() ?? "") === "true",
            );
        }
    }
}

export async function doAttention(text: string) {
    await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: text,
    });
}

$(async function () {
    const array = cacheWorker.getAllCachedPoints();
    document.getElementById("checkButton").addEventListener("click", addCheckButtonListener);
    document.getElementById("clearButton").addEventListener("click", clearTable);
    document.getElementById("radio-radius").addEventListener("change", addRadiusChangeListener);

    (await array)?.forEach((info) => {
        tableWorker.innerData(htmlParser.toHTML(info));
        graph.drawPoint(
            info?.x,
            info?.y,
            (info?.inRange?.toLowerCase() ?? "") === "true",
        );
    });

    const radius: number | null = findAndReturnSelectedRadius();
    if (radius !== null) {
        graph.redrawAll(radius);
    }
    drawAllPoints(graph);
});
