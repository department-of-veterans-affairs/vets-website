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

  // Handle title scenarios:
  // If title is a React element with an <h3>,
  // it should be made <h4> for the Review page.
  if (isStringTitle) {
    reviewTitle = !isEmptyStringTitle ? title : null;
  } else if (!onReviewPage) {
    reviewTitle = title;
  } else if (title.type !== 'h3') {
    reviewTitle = title;
  } else {
    reviewTitle = { ...title, type: 'h4' };
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
