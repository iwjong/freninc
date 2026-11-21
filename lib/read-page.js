import { readFile } from "node:fs/promises";
import path from "node:path";

const contentDir = path.join(process.cwd(), "content");

function readHtml(name) {
  return readFile(path.join(contentDir, `${name}.html`), "utf8");
}

export async function readPage(name) {
  const [header, body, footer, cookie] = await Promise.all([
    readHtml("header"),
    readHtml(name),
    readHtml("footer"),
    readHtml("cookie"),
  ]);

  return `${header}<main id="main-content">${body}</main>${footer}${cookie}`;
}
