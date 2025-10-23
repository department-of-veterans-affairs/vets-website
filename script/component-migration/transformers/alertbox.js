function alertBoxReplacement() {
  const moveToNamedSlot = componentString => {
    let translatedHeadline = componentString;
    const level = componentString.match(/level=["{](\d)["}]/)?.[1] || 3;
    const headline = componentString.match(/headline=(["{].+?["}])/m)?.[1];
    translatedHeadline = translatedHeadline.replace(/level=["{](\d)["}]/, '');
    translatedHeadline = translatedHeadline.replace(
      /headline=["{](.)+["}]/,
      '',
    );

    const childrenStart = translatedHeadline.indexOf('>') + 1;
    translatedHeadline = `
      ${translatedHeadline.slice(0, childrenStart)}
      <h${level} slot="headline">${headline}</h${level}>
      ${translatedHeadline.slice(childrenStart)}
      `;
    return translatedHeadline;
  };

  const moveChildren = (componentString, propName) => {
    let translatedChildren = componentString;
    const tag = [...componentString.match(/<(va-[a-z-]+)\s/)][1];
    const children = componentString.match(
      new RegExp(`${propName}=({.+})`, 's'),
    )?.[1];

    if (!children) return componentString;

    translatedChildren = translatedChildren.replace(
      `></${tag}`,
      `>\n${children}\n</${tag}`,
    );

    translatedChildren = translatedChildren.replace(children, '');
    translatedChildren = translatedChildren.replace(`${propName}=`, '');
    return translatedChildren;
  };

  const removeClassName = (componentString, _propName) => {
    let noClass = componentString;

    noClass = noClass.replace(/className=["{](.)+?["}]\s/ms, '');
    return noClass;
  };

  return [
    'va-alert',
    {
      headline: moveToNamedSlot,
      content: moveChildren,
      className: removeClassName,
      isVisible: 'visible',
    },
  ];
}

module.exports = { alertBoxReplacement };
