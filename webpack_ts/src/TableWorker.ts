export class TableWorker {
  private table: HTMLTableElement | null;

  constructor() {
    this.table = document.querySelector("table");
  }

  innerData(tableRow: string) {
    let tBody = this.table?.getElementsByTagName("tbody")[0];
    let row: HTMLTableRowElement = document.createElement("tr");
    row.innerHTML = tableRow;
    tBody?.appendChild(row);
  }

  getData(): Array<any> | null {
    let rows = this.table?.rows;
    if (!rows) {
      return null;
    }
    const array: Array<any> = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const requestTime: string = row.cells[0].innerText;
      const currentTime: string = row.cells[1].innerText;
      const inRange: string = row.cells[2].innerText;
      const x: string = row.cells[3].innerText;
      const y: string = row.cells[4].innerText;
      const r: string = row.cells[5].innerText;
      array.push({
        requestTime: requestTime,
        currentTime: currentTime,
        inRange: inRange,
        x: x,
        y: y,
        r: r,
      });
    }

    return array;
  }

  deleteAllRows(): void {
    let rows = this.table?.rows;
    if (!rows) {
      return;
    }
    for (let i = rows.length - 1; i > 0; i--) {
      this.table?.deleteRow(i);
    }
  }
}
