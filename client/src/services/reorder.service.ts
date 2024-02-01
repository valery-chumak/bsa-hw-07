import type { DraggableLocation } from "@hello-pangea/dnd";
import { Card, List } from "../common/types";

const removeItemAt = (array: any[], index: number) =>
  array.slice(0, index).concat(array.slice(index + 1));
const insertItemAt = (array: any[], index: number, item: any) =>
  array.slice(0, index).concat(item).concat(array.slice(index));

export const reorderService = {
  reorderLists(items: List[], startIndex: number, endIndex: number): List[] {
    const [removed] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, removed);

    return items;
  },

  reorderCards(
    lists: List[],
    source: DraggableLocation,
    destination: DraggableLocation,
  ): List[] {
    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId,
    );

    if (!sourceList || !destinationList) {
      return lists;
    }

    const current: Card[] = sourceList.cards || [];
    const next: Card[] = destinationList.cards || [];
    const target: Card = current[source.index];

    const isMovingInSameList = source.droppableId === destination.droppableId;

    if (isMovingInSameList) {
      const reordered: Card[] = removeItemAt(current, source.index);
      reordered.splice(destination.index, 0, target);

      return lists.map((list) =>
        list.id === source.droppableId ? { ...list, cards: reordered } : list,
      );
    }

    const newLists = lists.map((list) => {
      if (list.id === source.droppableId) {
        return { ...list, cards: removeItemAt(current, source.index) };
      }

      if (list.id === destination.droppableId) {
        return {
          ...list,
          cards: insertItemAt(next, destination.index, target),
        };
      }

      return list;
    });

    return newLists;
  },
};
