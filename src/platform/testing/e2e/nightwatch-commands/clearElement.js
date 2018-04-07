exports.command = function clearElement(selector, callback) {
  this.execute((sel) => {
    document.querySelector(sel).value = '';
  }, [selector], callback);
  return this;
};
