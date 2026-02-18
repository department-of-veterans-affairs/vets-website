import React from 'react';

import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ExpenseMealFields = ({ errors = {}, formState, onChange, onBlur }) => (
  <div className="vads-u-margin-top--2">
    <VaTextInput
      label="Where did you purchase the meal?"
      name="vendorName"
      value={formState.vendorName || ''}
      required
      onInput={onChange}
      onBlur={onBlur}
      {...errors.vendorName && { error: errors.vendorName }}
    />
  </div>
);

ExpenseMealFields.propTypes = {
  errors: PropTypes.object,
  formState: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default ExpenseMealFields;
