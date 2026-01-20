function additionalInfoReplacement() {
  /**
   * Remove prop from component if it exists.
   *
   * @param {string} componentString A string containing an occurrence of a component
   * @param {string} propName The name of the prop to be removed
   */
  const removeProp = (componentString, propName) => {
    const regex = new RegExp(`(${propName}=["{](.)+?["}])`);
    const propExists = componentString
      .substring(0, componentString.indexOf('>'))
      .includes(propName);
    return propExists ? componentString.replace(regex, '') : componentString;
  };

  return [
    'va-additional-info',
    {
      // className: removeProp,
      triggerText: 'trigger',
      disableAnalytics: 'disable-analytics',
      onClick: removeProp,
    },
  ];
}

module.exports = { additionalInfoReplacement };
