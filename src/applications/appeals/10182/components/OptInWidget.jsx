import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

import { OptInLabel, optInErrorMessage } from '../content/OptIn';

/**
 * Using a custom checkbox widget because the built-in checkbox will duplicate
 * the label (no checkbox); it is then followed by the error message, then
 * checkbox + label. With this widget, we hide the label (no checkbox), and the
 * error message appears below the proper label per design pattern
 */

const OptInWidget = props => {
  const { value, formContext, onChange } = props;
  const { onReviewPage, reviewMode, submitted } = formContext || {};

  const isOnReviewPage = onReviewPage || false;
  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const inReviewMode = (isOnReviewPage && reviewMode) || false;

  return isOnReviewPage && inReviewMode ? (
    <span>True</span>
  ) : (
    <Checkbox
      name="root_socOptIn"
      errorMessage={!value && submitted ? optInErrorMessage : ''}
      label={OptInLabel}
      ariaLabelledBy="opt-in-description"
      onValueChange={onChange}
      checked={value}
      required
    />
  );
};

OptInWidget.propTypes = {
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

export default OptInWidget;
