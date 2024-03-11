export default class Semaphore {
  constructor(value = 1) {
    this.value = value;
    this.queue = [];
  }

  wait() {
    if (this.value > 0) {
      this.value--;
    } else {
      return new Promise((resolve) => {
        this.queue.push(resolve);
      });
    }
  }

  signal() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.value++;
    }
  }
}
