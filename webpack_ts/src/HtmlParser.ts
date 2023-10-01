const TD_TAG: RegExp = /<td>(.*?)<\/td>/g;
export class HtmlParser {
  parse(row: string) {
    const matches = row.matchAll(TD_TAG);
    const rowData = [];

    for (const match of matches) {
      rowData.push(match[1]);
    }

    return {
      requestTime: rowData[0] || "",
      currentTime: rowData[1] || "",
      inRange: rowData[2] || "",
      x: rowData[3] || "",
      y: rowData[4] || "",
      r: rowData[5] || "",
    };
  }

  toHTML(object: any) {
    let html = "<tr>";
    for (const key in object) {
      html += "<td>" + object[key] + "</td>";
    }
    html += "</tr>";
    return html;
  }
}
