import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";
import { List } from "../data/models/list";

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
  }

  public deleteCard(cardId: string, listId: string): void {
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? list.setCards(list.cards.filter((card) => card.id !== cardId))
        : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

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
}
