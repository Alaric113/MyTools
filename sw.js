if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>i(e,t),a={module:{uri:t},exports:o,require:l};s[t]=Promise.all(n.map((e=>a[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-f435b8ee"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/GasPrice-4_FGjMFH.js",revision:null},{url:"assets/GasPrice-BsQPVe3D.css",revision:null},{url:"assets/index-BfTxUGlk.js",revision:null},{url:"assets/index-D8Cl7_76.css",revision:null},{url:"assets/MapContainer-BWYeDvyF.css",revision:null},{url:"assets/MapContainer-DtSe7Q0G.js",revision:null},{url:"assets/ParkingFinder-BdxNoJqs.js",revision:null},{url:"assets/ParkingFinder-D_UILcS9.css",revision:null},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"index.html",revision:"143f5228fb7ef48eaaf21b802014a9c2"},{url:"registerSW.js",revision:"168fe5f17bc5ee1c573194bc87b7d15b"},{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"manifest.webmanifest",revision:"51ad13daab2df3a4f9ed9622784c884a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/MyTools/index.html"))),e.registerRoute(/^https:\/\/api\.tomtom\.com/,new e.StaleWhileRevalidate({cacheName:"tomtom-api-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/vipmbr\.cpc\.com\.tw/,new e.NetworkFirst({cacheName:"cpc-oil-data",plugins:[new e.ExpirationPlugin({maxAgeSeconds:86400})]}),"GET")}));
