# SchedulerLab — Priority Task Scheduler Visualizer

An interactive priority task scheduler debugger built with **plain HTML, CSS, and JavaScript**. No build tooling, Node server, or external libraries needed. Open `index.html` or publish it through GitHub Pages.

## Features

- Default A/B/C/D scenario based on the provided assertions.
- Add arbitrary task IDs, priorities, durations, result values, and failure settings.
- Configurable concurrency from 1 to 8 workers.
- Simulated execution with **Next**, **Previous**, scrubber, and **Auto play**.
- Worker lanes, sorted waiting queue, virtual clock and jump-to-time controls.
- Execution timeline, highlighted source code, event log, and results in priority order.
- Button that runs the actual `TaskScheduler` implementation using real promises to verify the supplied test assertions.
- Extra scenarios for equal priority, repeated failures, and an empty queue.

## Behavior

`TaskScheduler` stores tasks before `run()` and sorts by descending priority, keeping original insertion order for ties. It dispatches at most `concurrency` tasks at any time. Each asynchronous worker picks another pending task after finishing one, including when a task rejects. Rejections are caught and added to the results, so `Promise.all(workers)` can resolve normally. Results are indexed by *sorted dispatch order* instead of completion order.

The scheduler's statuses are `PENDING`, `RUNNING`, `SUCCESS`, and `FAILED` to match the original assertions. The class is exposed to your browser console as `TaskScheduler`.

**Note:** The visual timeline is a deterministic simulation of tasks with specified durations. Native `setTimeout` callback ordering and exact timing can differ in a real browser, especially when tasks finish together.

## GitHub Pages

Deploy this directory beneath an existing Pages repository to serve it at:

`https://<username>.github.io/<repository>/priority-task-scheduler/`

For local use, open `index.html` directly. Every asset is embedded inside that single file.