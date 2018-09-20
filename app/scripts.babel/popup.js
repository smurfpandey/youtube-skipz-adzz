chrome.runtime.sendMessage({cmd: 'GET_ALL_ADS'}, (response) => {
  let dvAdList = document.getElementById('dvAdList');
  let dvNoAd = document.getElementById('dvNoAd');
  if(response.ads.length == 0) {
    return;
  }

  dvNoAd.classList.add('hide');
  dvAdList.classList.remove('hide');

  let tmplText = document.getElementById('tmplAdList').innerHTML;
  let adHtml = '';
  response.ads.sort((a, b) => {
    return b.skipped_on - a.skipped_on;
  })
  response.ads.forEach((ad) => {
    let thisHtml = tmplText.replace('{{title}}', ad.title).replace('{{url}}', ad.url);
    adHtml += thisHtml;
  });
  dvAdList.innerHTML = adHtml;
});