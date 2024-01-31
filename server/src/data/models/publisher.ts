export interface ILog {
  text: string;
  level: string;
}

interface Observer {
  inform(publisher: Publisher): void;
}

export class Publisher {
  public log: ILog;
  public subscribers: Observer[] = [];

  constructor() {}

  setLog(log: ILog) {
    this.log = log;
    this.notifyAll();
  }

  notifyAll() {
    return this.subscribers.forEach((subscriber) => {
      subscriber.inform(this);
    });
  }

  subscribe(observer: Observer) {
    this.subscribers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== observer
    );
  }
}
