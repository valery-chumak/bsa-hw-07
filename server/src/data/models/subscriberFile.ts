import * as fs from "fs";
import * as path from "path";
import { Publisher } from "./publisher";
// PATTERN: Observer

export class SubscriberFile {
  inform(publisher: Publisher) {
    const { text, level } = publisher.log;

    writeToFile(`[${level}]: ${text}`);
  }
}

function writeToFile(log: string): void {
  const fileName = "logfile.txt";
  const filePath = path.join(process.cwd(), fileName);

  fs.appendFile(filePath, `${log}\n`, (err) => {
    if (err) {
      console.error(`Error writing to file: ${err}`);
    }
  });
}
