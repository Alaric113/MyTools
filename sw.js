if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>i(e,t),a={module:{uri:t},exports:o,require:c};s[t]=Promise.all(n.map((e=>a[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-f435b8ee"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/GasPrice-36a9LdXd.js",revision:null},{url:"assets/GasPrice-VqriOHXD.css",revision:null},{url:"assets/index-CeQXB7Tq.js",revision:null},{url:"assets/index-ODyvZgsI.css",revision:null},{url:"assets/MapContainer-BiqvHnA7.css",revision:null},{url:"assets/MapContainer-CMOpiwtN.js",revision:null},{url:"assets/ParkingFinder-CJQAGQ-J.css",revision:null},{url:"assets/ParkingFinder-CjYsZvDp.js",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"index.html",revision:"cc2fe9aac4748643a86df8a998ec3940"},{url:"registerSW.js",revision:"a3a8cac87c3acee6dccd9a9bf2d30163"},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"manifest.webmanifest",revision:"80c76f8b6d548e3928e1e84e90e5f340"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/Mytools/index.html"))),e.registerRoute(/^https:\/\/api\.tomtom\.com/,new e.StaleWhileRevalidate({cacheName:"tomtom-api-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/vipmbr\.cpc\.com\.tw/,new e.NetworkFirst({cacheName:"cpc-oil-data",plugins:[new e.ExpirationPlugin({maxAgeSeconds:86400})]}),"GET")}));
