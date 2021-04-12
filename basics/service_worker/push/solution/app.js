// global handle to a possible new worker
let newWorker;

// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then(function(registration) {
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }

      // update handling in case a new version of the service worker is available
      registration.addEventListener('updatefound', () => {
        // An updated service worker has appeared in registration.installing!
        newWorker = registration.installing;

        // If the new service worker is already waiting. It means it was already successfully installed upon this point
        if (newWorker.waiting) {
          showNotification();
        } else {
          newWorker.addEventListener('statechange', () => {
            // Has service worker state changed?
            switch (newWorker.state) {
              case 'installed':
                // There is a new service worker available, show the notification
                if (navigator.serviceWorker.controller) {
                  showNotification();
                }

                break;
            }
          });
        }
      });

      pushManager.getSubscription().then(function(subscription) {
        isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('User IS subscribed.');

          const applicationServerKey = urlB64ToUint8Array(
            'BPDGTe1uJvBihLnkSj3g1PlEP1EFwXoRBRDUpY7Lrvw4pAsFGgsrRN4QTaCyYwdNv9FMXpDEwjEMmj1lgVR6hPU'
          );
          swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          });
        } else {
          console.log('User is NOT subscribed.');
        }
      });
    })
    .catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
}

// In case the reload button is pressed, activate the new service worker
document.getElementById('notification').addEventListener('click', function() {
  newWorker.postMessage({ action: 'skipWaiting' });
  document.getElementById('notification').className = '';
});

function showNotification() {
  let notification = document.getElementById('notification');
  notification.className = 'notification';
}

// function for loading each image via XHR
function imgLoad(imgJSON) {
  // return a promise for an image loading
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', imgJSON.url);
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse);
      } else {
        reject(
          Error(
            "Image didn't load successfully; error code:" + request.statusText
          )
        );
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

var imgSection = document.querySelector('section');

// rendering the site
window.onload = function() {
  // load each set of image, alt text, name and caption
  for (var i = 0; i <= Gallery.images.length - 1; i++) {
    imgLoad(Gallery.images[i]).then(
      function(arrayResponse) {
        var myImage = document.createElement('img');
        var myFigure = document.createElement('figure');
        var myCaption = document.createElement('caption');
        var imageURL = window.URL.createObjectURL(arrayResponse[0]);

        myImage.src = imageURL;
        myImage.setAttribute('alt', arrayResponse[1].alt);
        myCaption.innerHTML =
          '<strong>' +
          arrayResponse[1].name +
          '</strong>: Taken by ' +
          arrayResponse[1].credit;

        imgSection.appendChild(myFigure);
        myFigure.appendChild(myImage);
        myFigure.appendChild(myCaption);
      },
      function(Error) {
        console.log(Error);
      }
    );
  }
};
