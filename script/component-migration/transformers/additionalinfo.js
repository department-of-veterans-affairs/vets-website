function additionalInfoReplacement() {
  const removeClassName = (componentString, _propName) => {
    let noClass = componentString;

    noClass = noClass.replace(/className=["{](.)+?["}]\s/ms, '');
    return noClass;
  };

  return [
    'va-additional-info',
    {
      className: removeClassName,
      triggerText: 'trigger',
      disableAnalytics: 'disable-analytics',
      onClick: 'onclick',
    },
  ];
}

module.exports = { additionalInfoReplacement };
