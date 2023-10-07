import $ from "jquery";

export class TableWorker {
  private tBody: JQuery<HTMLElement> | null;

  constructor() {
    this.tBody = $("#tableData");
  }

  innerRows(tableRows: string): void {
    this.tBody?.html(tableRows);
  }

  innerRow(tableRow: string): void {
    let row: HTMLTableRowElement = document.createElement("tr");
    row.innerHTML = tableRow;
    this.tBody?.append(row);
  }

  getLastRow(): object | null {
    if (this.tBody.length) {
      const rows = this.tBody.find("tr");
      if (rows.length) {
        const lastRow = rows.last();
        const [
          requestTime = "",
          currentTime = "",
          inRange = "",
          x = "",
          y = "",
          r = "",
        ] = lastRow
          .find("td")
          .toArray()
          .map((element) => $(element).text());

        return {
          requestTime,
          currentTime,
          inRange,
          x,
          y,
          r,
        };
      }
    }

    return null;
  }

  deleteAllRows(): void {
    this.tBody.html("");
  }
}
