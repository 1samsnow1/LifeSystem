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

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
