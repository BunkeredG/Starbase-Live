const currentID = "ld:2223-0715-0914,rc:5";
const bodyMessage = "test notification";

// Scroll when opening <details>
document.querySelectorAll('details').forEach(function(details) {
  details.addEventListener('toggle', function() {
    if (details.open) {
      details.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  });
});

// Hash interaction
function openDetailsFromHash() {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (target && target.tagName === 'DETAILS') {
        target.open = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

window.addEventListener('DOMContentLoaded', openDetailsFromHash);
window.addEventListener('hashchange', openDetailsFromHash);

// Notification permissions button
const permsButton = document.getElementById('permissions');
if (permsButton) {
    const initCheck = localStorage.getItem('subscribed') === 'true';
    permsButton.textContent = initCheck ? "Stop Receiving Updates" : "Get Updates";

    permsButton.addEventListener('click', function() {
        const isSubscribed = localStorage.getItem('subscribed') === 'true';

        if (isSubscribed) {
            localStorage.setItem('subscribed', 'false');
            new Notification('Unsubscribed!', {body: "You will no longer receive updates"});
            permsButton.textContent = "Get Updates";
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    localStorage.setItem('subscribed', 'true');
                    new Notification('Subscribed!', {body: "Leave this site open to get updates as soon as they're published"});
                    permsButton.textContent = "Stop Receiving Updates";
                }
            });
        }
    });
}

// Notification push
const lastSeenID = localStorage.getItem('lastSeenUpdate');

if (lastSeenID !== currentID && localStorage.getItem('subscribed') === 'true') {
    if (Notification.permission === 'granted') {
        new Notification('Starbase Update', {body: bodyMessage});
    }
    localStorage.setItem('lastSeenUpdate', currentID);
}