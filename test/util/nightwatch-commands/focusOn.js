/**
 * Change select value and trigger change event programatically. This
 * is necessary because long select boxes tend to render offscreen,
 * causing Selenium to fail in unexpected ways.
 * The first parameter is the field name, not the whole selector.
 */
exports.command = function focusOn(selector) {
  this.execute((sel) => {
    document.querySelector(sel).focus();
  }, [selector]);

  return this;
};

