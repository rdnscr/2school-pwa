//load the worker
let worker = new Worker('my-worker.js');
//register callback
worker.addEventListener('message', function(e) {
  document.querySelector('#status').textContent = e.data;
});

document.querySelector('#taskButton').addEventListener('click', function(args) {
  //start the worker process
  worker.postMessage('start');
});

document.querySelector('#testAlive').addEventListener('click', function(args) {
  alert("I'm alive!");
});
