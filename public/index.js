'use strict';

// const API_KEY = window.GoogleSamples.Config.gcmAPIKey;
const pushButton = document.querySelector('#pushbtn');
const applicationServerPublicKey = 'BFkrVe14JxJfVEAUmvLNqD44J9FRPYLSdzYmTLWyJ1h061VHLBZc3Bnvi0IO9YEON5Ur8z-T6LiHeC6lJaeVNoI';
let swRegistration;
let isSubscribed = false;

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('./sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initialiseUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
// TODO: Send subscription to application server
  // console.log('Updating subscription : ', subscription);
  // let subscriptionfield = document.querySelector('#subscription');
  // console.log(subscriptionfield);
  // subscriptionfield.innerHTML = JSON.stringify(subscription);
  // showCurlCommand(subscription);

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send('endpoint=' + subscription.endpoint);
  // send_Notification(subscription);
  // const subscriptionJson = document.querySelector('.js-subscription-json');
  // const subscriptionDetails =
  //   document.querySelector('.js-subscription-details');

  // if (subscription) {
  //   subscriptionJson.textContent = JSON.stringify(subscription);
  //   subscriptionDetails.classList.remove('is-invisible');
  // } else {
  //   subscriptionDetails.classList.add('is-invisible');
  // }
}

function showCurlCommand(subscription) {
  let mergedEndpoint = String(subscription.endpoint);
  let curlfield = document.querySelector('#curlcommand');
  let GCM_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';
  let API_KEY = 'AIzaSyDWNKAoi6RDVYaTPKHTCx0o_1HCvI1oeGI';
  let endpointSections = mergedEndpoint.split('/');
  let subscriptionId = endpointSections[endpointSections.length - 1];

  let curlCommand = 'curl --header "Authorization: key=' + API_KEY +
    '" --header Content-Type:"application/json" ' + GCM_ENDPOINT +
    ' -d "{\\"registration_ids\\":[\\"' + subscriptionId + '\\"]}"';

    curlfield.textContent = curlCommand;
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}