import React from 'react';

import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaMemorableDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ExpenseLodgingFields = ({ errors = {}, formState, onChange }) => (
  <>
    <div className="vads-u-margin-top--2">
      <VaTextInput
        label="Where did you stay?"
        name="vendor"
        value={formState.vendor || ''}
        required
        onBlur={onChange}
        {...errors.vendor && { error: errors.vendor }}
      />
    </div>
    <VaMemorableDate
      label="Check in date"
      name="checkInDate"
      value={formState.checkInDate || ''}
      monthSelect
      removeDateHint
      external-validation
      required
      onDateChange={onChange}
      onDateBlur={onChange}
      error={errors.checkInDate}
    />
    <VaMemorableDate
      label="Check out date"
      name="checkOutDate"
      value={formState.checkOutDate || ''}
      monthSelect
      removeDateHint
      external-validation
      required
      onDateChange={onChange}
      onDateBlur={onChange}
      error={errors.checkOutDate}
    />
  </>
);

ExpenseLodgingFields.propTypes = {
  errors: PropTypes.object,
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseLodgingFields;
