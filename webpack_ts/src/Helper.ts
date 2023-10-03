import $ from "jquery";
import { InputValidator } from "./InputValidator";
import { TableWorker } from "./TableWorker";
import { Graph } from "./Graph";
import { HtmlParser } from "./HtmlParser";
import { CacheWorker } from "./CacheWorker";
import { alertError, alertSuccess } from "./SweerAlert";

const graph = new Graph();
const tableWorker = new TableWorker();
const inputValidator = new InputValidator();
const htmlParser = new HtmlParser();
const cacheWorker = new CacheWorker();

export async function clearTable() {
  const data: string | null = await sendRequest(
    {
      delete: "true",
    },
    "php/Server.php",
    "POST",
  );

  if (data) {
    await cacheWorker.clearCache();
    tableWorker.deleteAllRows();
    const radius: number | null = findAndReturnSelectedRadius();
    if (radius !== null) {
      graph.redrawAll(radius);
    }
    await alertSuccess("Table was cleared");
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
    const data: string | null = await sendRequest(
      {
        x: inputValidator.getX,
        y: inputValidator.getY,
        r: findAndReturnSelectedRadius(),
      },
      "php/Server.php",
      "POST",
    );

    if (data) {
      const point: object | null = htmlParser.parse(data);
      if (point) {
        await cacheWorker.putPoint(htmlParser.parse(data), "./data.html");
        tableWorker.deleteAllRows();
        tableWorker.innerRows(data);
        drawAllPoints(graph);
      } else {
        console.log("no points from server");
      }
    }
  }
}

function drawAllPoints(canvasPrinter: Graph): void {
  const data: Array<any> | null = tableWorker.getData();
  if (data) {
    data.forEach((point) => {
      canvasPrinter.drawPoint(
        point?.x,
        point?.y,
        (point?.inRange?.toLowerCase() ?? "") === "true",
      );
    });
  }
}

async function sendRequest(data: object, url: string, method: string) {
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
    });
    const info = await response.json();
    if (info?.status === "error") {
      await alertError(info?.message);
      return null;
    } else if (info?.status === "success") {
      return info?.message;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

$(async function () {
  const array = cacheWorker.getAllCachedPoints();
  $("#checkButton").on("click", addCheckButtonListener);
  $("#clearButton").on("click", clearTable);
  $("#radio-radius").on("change", addRadiusChangeListener);

  (await array)?.forEach((info) => {
    tableWorker.innerRow(htmlParser.toHTML(info));
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
