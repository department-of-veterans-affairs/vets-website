function loadingIndicatorReplacement() {
  const removeClassName = (componentString, _propName) => {
    let noClass = componentString;

    noClass = noClass.replace(/className=["{](.)+?["}]\s/ms, '');
    return noClass;
  };

  return [
    'va-loading-indicator',
    {
      className: removeClassName,
      setFocus: 'set-focus',
      enableAnalytics: 'enable-analytics',
    },
  ];
}

module.exports = { loadingIndicatorReplacement };
