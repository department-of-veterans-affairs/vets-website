function mountWidgets(widgets, isProduction) {
  // six seconds is our default threshold for something being slow
  var slowLoadingThreshold =  6000;

  [].slice
    .call(widgets)
    .filter(function(widget) {
      if (widget.production === false && isProduction) {
        return false;
      }

      return true;
    })
    .forEach(function(widget) {
      var timeout = widget.getAttribute('data-widget-timeout');
      if (timeout) {
        timeout = parseInt(timeout, 10);
      }
      timeout = (timeout || 0) * 1000;

      if (timeout > slowLoadingThreshold) {
        setTimeout(function() {
          var replacedWithWidget = !widget.querySelector('.static-widget-content');
          var slowMessage = widget.querySelector('.loading-indicator-message--slow');
          var regularMessage = widget.querySelector('.loading-indicator-message--normal');

          if (!replacedWithWidget && regularMessage) {
            regularMessage.setAttribute('aria-hidden', 'true');
            regularMessage.classList.add('vads-u-display--none');
          }

          if (!replacedWithWidget && slowMessage) {
            slowMessage.setAttribute('aria-hidden', 'false');
            slowMessage.classList.remove('vads-u-display--none');
          }
        }, slowLoadingThreshold);
      }

      if (timeout > 0) {
        setTimeout(function() {
          var replacedWithWidget = !widget.querySelector('.static-widget-content');
          var errorMessage = widget.querySelector('.sip-application-error');
          var loadingMessage = widget.querySelector('.loading-indicator-container');

          if (!replacedWithWidget && loadingMessage) {
            loadingMessage.remove();
          }

          if (!replacedWithWidget && errorMessage) {
            errorMessage.setAttribute('aria-hidden', 'false');
            errorMessage.classList.remove('vads-u-display--none');
          }
        }, timeout);
      }
    });
}

if (module) {
  module.exports = mountWidgets;
}
