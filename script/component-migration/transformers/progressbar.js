function progressBarReplacement() {
  const removeClassName = (componentString, _propName) => {
    let noClass = componentString;

    noClass = noClass.replace(/className=["{](.)+?["}]\s/ms, '');
    return noClass;
  };

  return [
    'va-progress-bar',
    {
      className: removeClassName,
    },
  ];
}

module.exports = { progressBarReplacement };
