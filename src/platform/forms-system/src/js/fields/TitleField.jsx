import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function TitleField({ id, title, formContext }) {
  const isRoot = id === 'root__title';
  const classes = classNames('schemaform-block-title testing', {
    'schemaform-block-subtitle': !isRoot,
  });
  const { onReviewPage } = formContext;
  let reviewTitle;

  const isStringTitle = typeof title === 'string';
  const isEmptyStringTitle = isStringTitle && title.trim() === '';
  const getReviewTitle = element => {
    // returns a conditionally-modify clone of title React-element,
    // with any header tags lowered by one level for Review page.
    if (Array.isArray(element)) {
      return element.map((child, index) => (
        <React.Fragment key={index}>{getReviewTitle(child)}</React.Fragment>
      ));
      // eslint-disable-next-line no-else-return
    } else if (typeof element === 'object' && element !== null) {
      const { type, props } = element;
      const newProps = { ...props };
      let newType;

      if (typeof type === 'string') {
        if (type.match(/^h[1-5]$/)) {
          newType = `h${parseInt(type.charAt(1), 10) + 1}`;
        } else if (type === 'h6') {
          newType = 'p';
        } else {
          newType = type;
        }
      } else {
        newType = type;
      }
      const newChildren = getReviewTitle(props.children);
      newProps.children = newChildren;
      return React.createElement(newType, newProps);
    }
    return element;
  };

  // Handle title scenarios:
  // If title is a React element with an <h3>,
  // it should be made <h4> for the Review page.
  if (isStringTitle) {
    reviewTitle = !isEmptyStringTitle ? title : null;
  } else if (!onReviewPage) {
    reviewTitle = title;
  } else {
    // title is a React fragment and on Review page, so
    // any header tags should be lowered by one level.
    reviewTitle = getReviewTitle(title);
  }

  return (
    <legend className={classes} id={id}>
      {reviewTitle}
    </legend>
  );
}

TitleField.defaultProps = {
  formContext: {
    onReviewPage: false,
  },
};

TitleField.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
  }),
};
