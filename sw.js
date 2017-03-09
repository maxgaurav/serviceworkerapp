var currentDate = '';

var CACHES_NAMES = ['v2'];

var url = '/serviceworkerapp/';

var urlsToCache = [
    url + 'css/bootstrap.min.css',
    url + 'js/jquery.min.js',
    url + 'js/bootstrap.min.js',
    url + 'index.html',
    url
];

/**
 * This event is fired when service worker is first installed/registered
 */
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    console.log(cacheName, CACHES_NAMES, CACHES_NAMES.indexOf(cacheName));
                    if(CACHES_NAMES.indexOf(cacheName) === -1){
                        return caches.delete(cacheName);
                    }
                })
            )
        }).then(function(){
            return Promise.all(
                CACHES_NAMES.map(function (cacheName) {
                    console.log('then called');
                    return caches.open(cacheName).then(function (cache) {
                        return cache.addAll(urlsToCache);
                    })

                })
            )
        })
    );
});

/**
 * This event is fired when a request of same origin is called from the system
 * It could be a css request, javascript request, ajax request or even a url hit request
 */
self.addEventListener('fetch', function (event) {
    console.log('fetch');

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});

self.addEventListener('push', function(event){
    console.log('Push received');

    console.log(event);

    var content = {
        body : (event.data.text()) || 'This is the body content(none given)',
        icon : 'images/launcher-icon-2x.png'
    };

    var title = "Push Notificaion Title";
    console.log(event.data.text());

    event.waitUntil(self.registration.showNotification(title, content));
});

self.addEventListener('sync', function(event){
    //backgroung syncing
    if(event.tag === "backgroundSyncImage"){
        event.waitUntil(
            fetch('images/launcher-icon-4x-sync.png')
        )
    }
});




