const getTextFromReactChildren = children => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(child => getTextFromReactChildren(child)).join('');
  }
  if (children && children.$$typeof === Symbol.for('react.element')) {
    return getTextFromReactChildren(children.props.children);
  }
  return '';
};

const getTextFromElement = element => {
  if (element && element.$$typeof === Symbol.for('react.element')) {
    return getTextFromReactChildren(element.props.children);
  }

  if (element.nodeType === Node.TEXT_NODE) {
    return element.nodeValue;
  }
  if (element.nodeType === Node.ELEMENT_NODE) {
    return Array.from(element.childNodes)
      .map(getTextFromElement)
      .join('');
  }
  return '';
};

export { getTextFromElement };
