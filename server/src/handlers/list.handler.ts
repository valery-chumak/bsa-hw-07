import type { Socket } from "socket.io";
import { ListEvent } from "../common/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";
import { Publisher } from "../data/models/publisher";
import { SubscriberConsole } from "../data/models/subscriberConsole";
import { SubscriberFile } from "../data/models/subscriberFile";

// PATTERN: Observer
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

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();

    const logEntry = {
      text: `Created list: "${name}"`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }

  public deleteList(listId: string): void {
    const lists = this.db.getData();

    this.db.setData(lists.filter((list) => list.id !== listId));

    this.updateLists();

    const logEntry = {
      text: `Deleted list: ${listId}`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }

  public renameList(listId: string, name: string): void {
    const lists: List[] = this.db.getData();

    lists.forEach((list) => {
      if (list.id === listId) {
        list.name = name;
      }
    });

    this.db.setData(lists);

    this.updateLists();

    const logEntry = {
      text: `Renamed list: ${listId} on "${name}"`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }
}
