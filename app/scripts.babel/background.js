'use strict';

let cache = new Cache(5);

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status === 'complete' && tab.url.startsWith('https://www.youtube.com/watch')) {    
    chrome.tabs.sendMessage(tabId, { tabUrl: tab.url });
  }  
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.cmd == 'SAVE_AD') {
    cache.store(request.payload);
  }
});

chrome.browserAction.onClicked.addListener(() => {
  console.log(cache.getAll());
});