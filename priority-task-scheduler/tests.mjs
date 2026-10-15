import assert from 'node:assert/strict';
import { TaskScheduler } from './scheduler.mjs';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const scheduler = new TaskScheduler(2);
let active = 0;
let maxActive = 0;
function createTask(name, ms, fail = false) {
  return async () => {
    active++;
    maxActive = Math.max(maxActive, active);
    await sleep(ms);
    active--;
    if (fail) throw new Error('Task failed');
    return name;
  };
}
scheduler.add('A', 1, createTask('A', 10));
scheduler.add('B', 10, createTask('B', 30));
scheduler.add('C', 10, createTask('C', 20, true));
scheduler.add('D', 5, createTask('D', 10));
const results = await scheduler.run();
assert.deepEqual(results.map(r => r.id), ['B', 'C', 'D', 'A']);
assert.equal(maxActive, 2);
assert.equal(results[1].status, 'FAILED');
assert.equal(results[3].status, 'SUCCESS');
assert.equal(results[1].error, 'Task failed');
assert.throws(() => scheduler.add('X', 1, () => {}), /Already Started/);
await assert.rejects(scheduler.run(), /Already Started/);
const tie = new TaskScheduler(1);
tie.add('X', 2, () => Promise.resolve('X'));
tie.add('Y', 2, () => Promise.resolve('Y'));
assert.deepEqual((await tie.run()).map(x => x.id), ['X', 'Y']);
const empty = new TaskScheduler(2);
assert.deepEqual(await empty.run(), []);
const dup = new TaskScheduler(1);
dup.add('A', 1, () => 'ok');
assert.throws(() => dup.add('A', 2, () => 'again'), /Duplicate Task/);
console.log(results);
console.log('All tests passed');
