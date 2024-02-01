import { ReorderService } from "../../services/reorder.service";
import { List } from "./list";
// PATTERN: Proxy
export class ReorderServiceProxy {
  private reorderService: ReorderService;

  constructor(reorderService: ReorderService) {
    this.reorderService = reorderService;
    return new Proxy(this, this.methodInterceptor);
  }

  private methodInterceptor: ProxyHandler<ReorderServiceProxy> = {
    get: (target, prop: string, receiver) => {
      const originalMethod = target.reorderService[prop];

      if (typeof originalMethod === "function") {
        return function (...args: any[]) {
          console.log(`Logging input parameters for method ${prop}:`, args);
          const result = originalMethod.apply(target.reorderService, args);
          return result;
        };
      } else {
        return originalMethod;
      }
    },
  };

  reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    return this.reorderService.reorder(items, startIndex, endIndex);
  }

  reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    return this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }

  // You can expose additional methods or properties of ReorderService here if needed
}
