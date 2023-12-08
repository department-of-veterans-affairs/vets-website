import React from 'react';

// This function recursively extracts text from a React element's children.

const getTextFromReactElement = element => {
  if (typeof element === 'string') {
    return element;
  }
  if (
    React.isValidElement(element) &&
    element.props &&
    element.props.children
  ) {
    return React.Children.toArray(element.props.children)
      .map(getTextFromReactElement)
      .join('');
  }
  return '';
};

export { getTextFromReactElement };
