class TaskScheduler {
  constructor(concurrency = 2) {
    if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error('Invalid Concurrency');
    this.concurrency = concurrency;
    this.tasks = [];
    this.ids = new Set();
    this.started = false;
  }
  add(id, priority, fn) {
    if (this.started) throw new Error('Already Started');
    if (this.ids.has(id)) throw new Error('Duplicate Task');
    if (!Number.isFinite(priority)) throw new Error('Invalid Priority');
    if (typeof fn !== 'function') throw new Error('Invalid Task');
    this.ids.add(id);
    this.tasks.push({id, priority, fn, order: this.tasks.length, status: 'PENDING'});
  }
  async run() {
    if (this.started) throw new Error('Already Started');
    this.started = true;
    this.tasks.sort((a,b) => b.priority - a.priority || a.order - b.order);
    let nextIndex = 0;
    const results = new Array(this.tasks.length);
    const worker = async () => {
      while (nextIndex < this.tasks.length) {
        const index = nextIndex++;
        const task = this.tasks[index];
        task.status = 'RUNNING';
        try {
          const result = await task.fn();
          task.status = 'SUCCESS';
          results[index] = {id: task.id, status: 'SUCCESS', result};
        } catch (err) {
          task.status = 'FAILED';
          results[index] = {id: task.id, status: 'FAILED', error: String(err?.message ?? err)};
        }
      }
    };
    const count = Math.min(this.concurrency, this.tasks.length);
    const workers = [];
    for (let i = 0; i < count; i++) workers.push(worker());
    await Promise.all(workers);
    return results;
  }
}

export { TaskScheduler };
