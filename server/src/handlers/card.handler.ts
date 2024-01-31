import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";
import { List } from "../data/models/list";
import { Publisher } from "../data/models/publisher";
import { SubscriberConsole } from "../data/models/subscriberConsole";
import { SubscriberFile } from "../data/models/subscriberFile";
import * as path from "path";

const publisher = new Publisher();
const consoleSubscriber = new SubscriberConsole();
const fileSubscriber = new SubscriberFile();

publisher.subscribe(consoleSubscriber);
publisher.subscribe(fileSubscriber);

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.RENAME, this.changeTitle.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
  // PATTERN: Prototype
  public duplicateCard(cardId: string, listId: string): void {
    const list: List = this.db.getData().find((list) => list.id === listId);
    const card: Card = list.cards.find((card) => card.id === cardId);

    const duplicatedCard = card.duplicate();
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(list.cards.concat(duplicatedCard))
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();

    const logEntry = {
      text: `Duplicated card: ${duplicatedCard.name}`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }

  public deleteCard(cardId: string, listId: string): void {
    const lists: List[] = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(list.cards.filter((card) => card.id !== cardId))
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
    const logEntry = {
      text: `Deleted card: ${cardId}`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }

  public changeDescription(
    listId: string,
    cardId: string,
    description: string
  ): void {
    const lists: List[] = this.db.getData();

    lists.forEach((list) => {
      if (list.id === listId) {
        list.cards.forEach((card) => {
          if (card.id === cardId) {
            card.description = description;
          }
        });
      }
    });

    this.db.setData(lists);

    this.updateLists();

    const logEntry = {
      text: `Change description card: ${cardId}`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }

  public changeTitle(listId: string, cardId: string, name: string): void {
    const lists: List[] = this.db.getData();

    lists.forEach((list) => {
      if (list.id === listId) {
        list.cards.forEach((card) => {
          if (card.id === cardId) {
            card.name = name;
          }
        });
      }
    });

    this.db.setData(lists);
    this.updateLists();
    const logEntry = {
      text: `Change title card: ${cardId}`,
      level: "info",
    };
    publisher.setLog(logEntry);
  }
}
