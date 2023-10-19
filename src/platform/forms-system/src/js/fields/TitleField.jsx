import React from 'react';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { getReviewTitle } from '../helpers';

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
  if (isStringTitle) {
    reviewTitle = !isEmptyStringTitle ? title : null;
  } else if (!onReviewPage) {
    reviewTitle = isEmpty(title) ? null : title;
  } else {
    // title here is a React fragment and on Review page, so
    // any header tags in children should be lowered by one level.
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
