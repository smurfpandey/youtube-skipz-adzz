'use strict';

let cache = new Cache(5);

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === 'complete' && tab.url.startsWith('https://www.youtube.com/watch')) {    
    chrome.tabs.sendMessage(tabId, { tabUrl: tab.url });
  }  
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.cmd == 'SAVE_AD') {
    cache.store(request.payload);
  } else if (request.cmd == 'GET_ALL_ADS') {
    sendResponse({ ads: cache.getAll() });
  }
});

chrome.runtime.onSuspend.addListener(() => {
  cache.persist();
});