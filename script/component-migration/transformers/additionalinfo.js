function additionalInfoReplacement() {
  // eslint-disable-next-line no-unused-vars
  const removeProp = (componentString, propName) => {
    const component = componentString;
    const regex = new RegExp(`(?<!>)(${propName}=["{](.)+?["}])`, 'ms');
    component.replace(regex, '');
    return component;
  };

  return [
    'va-additional-info',
    {
      // className: removeProp,
      triggerText: 'trigger',
      disableAnalytics: 'disable-analytics',
      // onClick: removeProp,
    },
  ];
}

module.exports = { additionalInfoReplacement };
