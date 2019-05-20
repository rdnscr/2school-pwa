this.addEventListener('message', function(e) {
  const MAX = 100000;
  if (e.data === 'start') {
    for (i = 0; i < MAX; i++) {
      console.log(i + ' of ' + MAX + ' done');

      if (i % 1000 === 0) {
        // since the worker has no access to the dome this won't work
        // document.querySelector('#status').textContent =
        //   i + ' calculations done of ' + MAX;

        //instead we need to post back to the main thread
        this.postMessage(i + ' calculations done of ' + MAX);
      }
    }

    this.postMessage('worker has completed successfully');
  }
});
