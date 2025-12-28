const CACHE_NAME = "lifesystem-v1";

const ASSETS = [
  "./",
  "./index.html",

  // styles
  "./src/styles/output.css",

  // scripts
  "./src/components/checkingIcon.js",
  "./src/components/cornerIcon.js",
  "./src/components/installIcon.js",
  "./src/components/priorityIcons.js",
  "./src/components/ProfileDeleteIcon.js",
  "./src/scripts/app.js",
  "./src/scripts/tasks.js",
  "./src/scripts/options.js",
  "./src/scripts/saveImage.js",

  // optional: icons
  "./src/images/LifeSystemPNGVDesktop.png",
  "./src/images/LifeSystemPNGVMobile.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', evt=>{
    evt.waitUntil(
        caches.keys().then(keys=>{
           return Promise.all(keys.filter(key=>key !== CACHE_NAME).map(key=>caches.delete(key))
        )}
        )
    )
});

self.addEventListener('fetch', evt => {
    // console.log("fetch event: ", evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes=>{
            return cacheRes || fetch(evt.request).then(fetchRes=>{
                return caches.open(CACHE_NAME).then(cache=>{
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
      )
})
