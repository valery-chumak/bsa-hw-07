interface ILog {
  text: string;
  level: string;
}

class Publisher {
  public log: ILog;
  public subscribers: [];

  constructor() {}

  // setLog(log: ILog, subscribers: []) {
  //   this.log = log;
  //   this.subscribers = subscribers;
  //   this.notifyAll();
  // }

  // notifyAll() {
  //   return this.subscribers.forEach((subscriber) => {
  //     subscriber.inform(this);
  //   });
  // }

  subscribe() {}
}
