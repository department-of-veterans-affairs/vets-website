function additionalInfoReplacement() {
  const removeProp = (componentString, propName, newTag) => {
    const noProp = componentString;
    const regex = new RegExp(
      `(?<=<${newTag}.+?)(${propName}=["{].+?[}"])(?=.+?>)`,
      'ms',
    );
    noProp.replace(regex, '');
    return noProp;
  };

  return [
    'va-additional-info',
    {
      className: removeProp,
      triggerText: 'trigger',
      disableAnalytics: 'disable-analytics',
      onClick: 'onclick',
    },
  ];
}

module.exports = { additionalInfoReplacement };
