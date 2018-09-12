'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

console.log('\'Allo \'Allo! Event Page');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status === 'complete' && tab.url.startsWith('https://www.youtube.com/watch')) {    
    chrome.tabs.sendMessage(tabId, { tabUrl: tab.url });
  }  
});