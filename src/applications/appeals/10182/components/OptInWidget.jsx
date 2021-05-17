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

  return (
    <Checkbox
      name="root_socOptIn"
      errorMessage={!value && formContext.submitted ? optInErrorMessage : ''}
      label={OptInLabel}
      ariaLabelledBy="opt-in-description"
      onValueChange={val => onChange(val)}
      checked={value}
      required
    />
  );
};

OptInWidget.propTypes = {
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
  onChange: PropTypes.func,
  value: PropTypes.boolean,
};

export default OptInWidget;
