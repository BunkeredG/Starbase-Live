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
                    fetch('update.json', {cache: 'no-store'}).then(response => response.json()).then(data => {
                        localStorage.setItem('subscribed', 'true');
                        localStorage.setItem('lastSeenUpdate', data.id);
                        new Notification('Subscribed!', {body: "Leave this site open to get updates as soon as they're published"});
                        permsButton.textContent = "Stop Receiving Updates";
                    });
                }
            });
        }
    });
}

// Check for notification update
function checkForUpdate() {
    fetch('update.json', {cache: 'no-store'}).then(response => response.json()).then(data => {
        const lastSeenID = localStorage.getItem('lastSeenUpdate');

        if (lastSeenID !== data.id) {
            if (localStorage.getItem('subscribed') === 'true' && Notification.permission === 'granted') {
                new Notification('Starbase Updates', {body: data.message});
            }
            localStorage.setItem('lastSeenUpdate', data.id);
        }
    });
}
checkForUpdate();
setInterval(checkForUpdate, 60000);

// Countdown to launch
const windowOpen = new Date("2026-09-22T07:15:00-05:00");
const windowClose = new Date("2026-09-22T09:14:00-05:00");
const notifyKey = windowOpen.toISOString();

function updateCountdown() {
    const now = new Date();
    const openDiff = windowOpen - now;
    const closeDiff = windowClose - now;

    if (localStorage.getItem('closeNotify-' + notifyKey) === 'true') {
        clearInterval(timer);
        return;
    }

    if (closeDiff < 0) {
        document.getElementById('launchTimer').textContent = "(Window Closed)";
        
        if (localStorage.getItem('closeNotify-' + notifyKey) !== 'true' && localStorage.getItem('subscribed') === 'true' && Notification.permission === 'granted') {
            new Notification('Starbase Updates', {body: "Launch window is closed"});
            localStorage.setItem('closeNotify-' + notifyKey, 'true');
        }

        clearInterval(timer);
        return;
    }

    if (openDiff < 0) {
        if (localStorage.getItem('openNotify-' + notifyKey) !== 'true' && localStorage.getItem('subscribed') === 'true' && Notification.permission === 'granted') {
            new Notification('Starbase Updates', {body: "Launch window is open!"});
            localStorage.setItem('openNotify-' + notifyKey, 'true');
        }
    }

    if (openDiff - (1000 * 60 * 10) < 0) {
        if (localStorage.getItem('10minNotify-' + notifyKey) !== 'true' && localStorage.getItem('subscribed') === 'true' && Notification.permission === 'granted') {
            new Notification('Starbase Updates', {body: "Launch window opens in 10 minutes!"});
            localStorage.setItem('10minNotify-' + notifyKey, 'true');
        }
    }

    if (openDiff - (1000 * 60 * 60) < 0) {
        if (localStorage.getItem('1hrNotify-' + notifyKey) !== 'true' && localStorage.getItem('subscribed') === 'true' && Notification.permission === 'granted') {
            new Notification('Starbase Updates', {body: "Launch window opens in 1 hour!"});
            localStorage.setItem('1hrNotify-' + notifyKey, 'true');
        }
    }

    let diff;
    let preM;

    if (openDiff >= 0) {
        diff = openDiff;
        preM = "";
    } else {
        diff = closeDiff;
        preM = "Window Open for ";
    }

    const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    document.getElementById('launchTimer').textContent = `(${preM}${days}:${hours}:${minutes}:${seconds})`;
}

updateCountdown();
const timer = setInterval(updateCountdown, 1000);