import type { Socket } from "socket.io";
import { ListEvent } from "../common/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";
import { ILog, Publisher } from "../data/models/publisher";
import { SubscriberConsole } from "../data/models/subscriberConsole";
import { SubscriberFile } from "../data/models/subscriberFile";

// PATTERN: Observer
let logEntry: ILog;
const publisher = new Publisher();
const consoleSubscriber = new SubscriberConsole();
const fileSubscriber = new SubscriberFile();

publisher.subscribe(consoleSubscriber);
publisher.subscribe(fileSubscriber);

export class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
  }

  private createList(name: string): void {
    try {
      if (name.length < 3) {
        logEntry = {
          text: `Warning: List name "${name}" is very short.`,
          level: "warning",
        };
        publisher.setLog(logEntry);
      }
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();
      logEntry = {
        text: `Created list: "${name}"`,
        level: "info",
      };
    } catch (error) {
      logEntry = {
        text: `Error on create list: "${name}"`,
        level: "error",
      };
    } finally {
      publisher.setLog(logEntry);
    }
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex,
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  public deleteList(listId: string): void {
    try {
      const lists = this.db.getData();
      this.db.setData(lists.filter((list) => list.id !== listId));
      this.updateLists();

      logEntry = {
        text: `Deleted list: ${listId}`,
        level: "info",
      };
    } catch (error) {
      logEntry = {
        text: `Error on delete list: ${listId}`,
        level: "error",
      };
    } finally {
      publisher.setLog(logEntry);
    }
  }

  public renameList(listId: string, name: string): void {
    try {
      if (name.length < 3) {
        logEntry = {
          text: `Warning: List name "${name}" is very short.`,
          level: "warning",
        };
        publisher.setLog(logEntry);
      }
      const lists: List[] = this.db.getData();

      lists.forEach((list) => {
        if (list.id === listId) {
          list.name = name;
        }
      });

      this.db.setData(lists);
      this.updateLists();

      logEntry = {
        text: `Renamed list: ${listId} on "${name}"`,
        level: "info",
      };
    } catch (error) {
      logEntry = {
        text: `Error on rename list: ${listId} on "${name}"`,
        level: "error",
      };
    } finally {
      publisher.setLog(logEntry);
    }
  }
}
