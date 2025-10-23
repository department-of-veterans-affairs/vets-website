import React from 'react';
import PropTypes from 'prop-types';
import { MessageAlert } from './MessageAlert';
import { NONE_SELECTED_ERROR } from '../constants';

/**
 * Shows the alert box only if the form has been submitted
 */
export const NoneSelectedAlert = ({ count, headerLevel = 3, inReviewMode }) => {
  const title = `You’ll need to ${
    count === 0 ? 'add, and select,' : 'select'
  } an issue`;
  const classes = `vads-u-margin-${inReviewMode ? 'y' : 'bottom'}--2`;

  return (
    <MessageAlert
      title={title}
      message={NONE_SELECTED_ERROR}
      headerLevel={headerLevel}
      errorKey="no_eligible_issues_selected"
      errorReason="No eligible issues selected"
      classes={classes}
    />
  );
};

NoneSelectedAlert.propTypes = {
  count: PropTypes.number,
  headerLevel: PropTypes.number,
  inReviewMode: PropTypes.bool,
};
