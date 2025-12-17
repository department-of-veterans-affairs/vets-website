import React from 'react';

import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ExpenseLodgingFields = ({ errors = {}, formState, onChange }) => (
  <>
    <VaTextInput
      label="Where did you stay?"
      name="vendor"
      value={formState.vendor || ''}
      required
      onInput={onChange}
      {...errors.vendor && { error: errors.vendor }}
    />
    <VaDate
      label="Check in date"
      name="checkInDate"
      value={formState.checkInDate || ''}
      required
      onDateChange={onChange}
      {...errors.checkInDate && { error: errors.checkInDate }}
    />
    <VaDate
      label="Check out date"
      name="checkOutDate"
      value={formState.checkOutDate || ''}
      required
      onDateChange={onChange}
      {...errors.checkOutDate && { error: errors.checkOutDate }}
    />
  </>
);

ExpenseLodgingFields.propTypes = {
  errors: PropTypes.object,
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseLodgingFields;
