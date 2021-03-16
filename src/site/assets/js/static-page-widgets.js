function mountWidgets(widgets, slowLoadingThreshold) {
  [].slice
    .call(widgets)
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
            loadingMessage.parentNode.removeChild(loadingMessage);
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
