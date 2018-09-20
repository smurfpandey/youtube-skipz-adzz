function Cache(maxLength) {
  this.values = [];
  
  chrome.storage.local.get('ads', (data) => {
    if(data.ads) {
      this.values = data.ads;
    }
  });

  this.store = function(data) {
    if(this.values.length >= maxLength) {
      this.getLast();
    }
    return this.values.push(data);
  }

  this.getLast = function() {
    return this.values.splice(0,1)[0];
  }

  this.getAll = function() {
    return this.values;
  }
  
  this.persist = function() {
    if(this.values.length === 0)
      return;
    chrome.storage.local.set({ads: this.values});
  }
}