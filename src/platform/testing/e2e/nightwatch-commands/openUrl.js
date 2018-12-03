exports.command = function openUrl(url, disableForesee = true) {
  this.openUrl(url);

  if (disableForesee) {
    this.execute(() => {
      const css = document.createElement('style');
      css.type = 'text/css';
      css.innerHTML = '.__acs { display: none !important; }';
      document.body.appendChild(css);
    }, []);
  }

  return this;
};
