'use strict';

console.log('\'Allo \'Allo! Content script');

let tabUrl;
let ourVideoPlayer;
let skipAdBtn;
let intervalPlayerFinder;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tabUrl !== tabUrl) {
    tabUrl = request.tabUrl;    
    if (!ourVideoPlayer) {
      findThePlayer();
    }
  }
});

function findThePlayer() {
  ourVideoPlayer = document.querySelector('#player-container .html5-video-container video');
  if (ourVideoPlayer) {
    if (intervalPlayerFinder) {
      clearInterval(intervalPlayerFinder);
    }
    fixTheGame();
  } else {
    intervalPlayerFinder = setInterval(() => {
      findThePlayer();
    }, 250);
  }
}

function fixTheGame() {
  // try to see if btn already exists
  skipAdBtn = document.querySelector('button.videoAdUiSkipButton');
  if (skipAdBtn) {
    console.log('Bhai ko ad mila hai!!!!');

    let adClicker = setInterval(() => {
      if (skipAdBtn.offsetParent !== null) {
        skipAdBtn.click();
        skipAdBtn = undefined;
        console.log('Bhai Kamal kr dia aapne to!!!!');
        clearInterval(adClicker);
      }
    }, 950);
  } else {
    // button not there yet
    // maybe the video hasn't started?
    // so...
    ourVideoPlayer.addEventListener('playing', function (e) {
      skipAdBtn = document.querySelector('button.videoAdUiSkipButton');
      if (skipAdBtn) {
        console.log('Bhai ko ad mila hai!!!!');

        let adClicker = setInterval(() => {
          if (skipAdBtn.offsetParent !== null) {
            skipAdBtn.click();
            skipAdBtn = undefined;
            console.log('Bhai Kamal kr dia aapne to!!!!');
            clearInterval(adClicker);
          }
        }, 950);
      }
    });
  }
}