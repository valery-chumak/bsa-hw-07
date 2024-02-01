import { ILog, Publisher } from "./publisher";
// PATTERN: Observer
export class SubscriberConsole {
  inform(publisher: Publisher) {
    const { text, level } = publisher.log;
    if (level === "error") {
      console.error(`[Console] ${text}`);
    }
  }
}
