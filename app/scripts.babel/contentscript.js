'use strict';

console.log('\'Allo \'Allo! Content script');

let tabUrl;
let ourVideoPlayer;
let skipAdBtn;
let intervalPlayerFinder;
let adClickerTimer;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // check if this is a new page or what?
  if (request.tabUrl !== tabUrl) {
    
    // new navigation happened
    // reset variables
    skipAdBtn = undefined;
    adClickerTimer = undefined;
    intervalPlayerFinder = undefined;

    tabUrl = request.tabUrl;    
    if (!ourVideoPlayer) {
      findThePlayer();
    } else {
      fixTheGame();
    }
  }
});

function findThePlayer() {
  ourVideoPlayer = document.querySelector('#player-container .html5-video-container video');
  if (ourVideoPlayer) {
    if (intervalPlayerFinder) {
      clearInterval(intervalPlayerFinder);
    }
    ourVideoPlayer.addEventListener('playing', fixTheGame);
    ourVideoPlayer.addEventListener('play', fixTheGame);
    fixTheGame();
  } else {
    if(!intervalPlayerFinder) {
      console.log('starting timer to find the video player');
      intervalPlayerFinder = setInterval(() => {
        findThePlayer();
      }, 250);
    } else {
      console.log('timer already running to find the videplayer');
    }
  }
}

function fixTheGame() {
  if(!skipAdBtn) {
    skipAdBtn = document.querySelector('button.videoAdUiSkipButton');
    if(skipAdBtn) {
      console.log('button found. setting up timer for clicker');
      // we found the button
      if(!adClickerTimer) {
        adClickerTimer = setInterval(() => {
          if (skipAdBtn && skipAdBtn.offsetParent !== null) {

            // save this ad in temp list
            let adTitle = '[title]';
            let adUrl = '';
            if(document.querySelector('div.videoAdUiTitle')) {
              adTitle = document.querySelector('div.videoAdUiTitle').textContent;
            }
            if(document.querySelector('a.ytp-title-link')) {
              adUrl = document.querySelector('a.ytp-title-link').href;
            }
            if(adUrl) {
              let skipTime = new Date().getTime() / 1000;
              chrome.runtime.sendMessage({cmd: 'SAVE_AD', payload: { title: adTitle, url: adUrl, skipped_on: skipTime }});
            }

            skipAdBtn.click();

            clearInterval(adClickerTimer);
            adClickerTimer = undefined;
            skipAdBtn = undefined;
          }
        }, 950);
      } else {
        console.log('timer for clicker already exists');
      }
      return true;    
    } else {
      console.log('button not found');
      console.log('we will wait for the video player events to start the search');
      return false;
    }
  } else {
    console.log('button already found');
    return true;
  }
}