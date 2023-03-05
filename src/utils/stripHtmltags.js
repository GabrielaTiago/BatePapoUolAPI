import { stripHtml } from "string-strip-html";

export function stripHtmlTags(data) {
  return stripHtml(data).result;
}
