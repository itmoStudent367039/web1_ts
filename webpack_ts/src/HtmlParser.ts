export class HtmlParser {
  TD_TAG: RegExp = /<td>(.*?)<\/td>/g;
  TR_TAG: RegExp = /(.*?)<\/tr>/g;

  parse(rows: string): object | null {
    let matchesTr;
    let lastMatch;

    while ((matchesTr = this.TR_TAG.exec(rows)) !== null) {
      lastMatch = matchesTr[0];
    }

    if (lastMatch) {
      const matches = lastMatch.matchAll(this.TD_TAG);
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
    } else {
      return null;
    }
  }

  toHTML(object: any): string {
    let html = "<tr>";
    for (const key in object) {
      html += "<td>" + object[key] + "</td>";
    }
    html += "</tr>";
    return html;
  }
}
