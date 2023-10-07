export class HtmlParser {
  toHTML(object: DynamicObject): string {
    let html = "<tr>";
    for (const key in object) {
      if (key) {
        html += "<td>" + object[key] + "</td>";
      }
    }
    html += "</tr>";
    return html;
  }
}
interface DynamicObject {
  [key: string]: string;
}
