import $ from "jquery";
import { InputValidator } from "./InputValidator";
import { TableWorker } from "./TableWorker";
import { Graph } from "./Graph";
import { HtmlParser } from "./HtmlParser";
import { CacheWorker } from "./CacheWorker";
import { alertError, alertSuccess } from "./SweetAlert";

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

export async function addRadiusChangeListener() {
  const radius: number | null = findAndReturnSelectedRadius();
  if (radius !== null) {
    graph.redrawAll(radius);
  }
  await drawAllPoints(graph);
}

function findAndReturnSelectedRadius(): number | null {
  const selectedElement = document.querySelector("input[name='R']:checked");
  if (selectedElement instanceof HTMLInputElement) {
    return +selectedElement.value;
  }
  return null;
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
      tableWorker.deleteAllRows();
      tableWorker.innerRows(data);
      const lastPoint: object | null = tableWorker.getLastRow();
      if (lastPoint) {
        await cacheWorker.putPoint(lastPoint, "./data.html");
        await drawAllPoints(graph);
      } else {
        console.log("no points from server");
      }
    }
  }
}

async function drawAllPoints(canvasPrinter: Graph) {
  const data = cacheWorker.getAllCachedPoints();
  (await data)?.forEach((point) => {
    canvasPrinter.drawPoint(
      point?.x,
      point?.y,
      (point?.inRange?.toLowerCase() ?? "") === "true",
    );
  });
}

async function sendRequest(
  data: object,
  url: string,
  method: string,
): Promise<string> | null {
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
    });
    const info = await response.json();
    if (info?.status === "success") {
      return info?.message;
    } else if (info?.status === "error") {
      await alertError(info?.message);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
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
  await drawAllPoints(graph);
});
