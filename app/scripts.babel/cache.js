function Cache(maxLength) {
  this.values = [];

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
}