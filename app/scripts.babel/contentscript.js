'use strict';

console.log('\'Allo \'Allo! Content script');

let tabUrl;
let ourVideoPlayer;
let skipAdBtn;
let intervalPlayerFinder;
let adClickerTimer;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tabUrl !== tabUrl) {
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