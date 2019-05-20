document.querySelector('#taskButton').addEventListener('click', function(args) {
  const MAX = 100000;
  // This loop will kill the entire site
  for (i = 0; i < MAX; i++) {
    console.log(i + ' of ' + MAX + ' done');

    if (i % 1000 === 0) {
      document.querySelector('#status').textContent =
        i + ' calculations done of ' + MAX;
    }
  }
});

document.querySelector('#testAlive').addEventListener('click', function(args) {
  alert("I'm alive");
});
