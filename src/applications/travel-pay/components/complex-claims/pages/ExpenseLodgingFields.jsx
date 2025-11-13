import React from 'react';

import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ExpenseLodgingFields = ({ formState, onChange }) => (
  <>
    <VaTextInput
      label="Where did you stay?"
      name="vendor"
      value={formState.vendor || ''}
      required
      onInput={onChange}
    />
    <VaDate
      label="Check in date"
      name="checkInDate"
      value={formState.checkInDate || ''}
      required
      onDateChange={onChange}
    />
    <VaDate
      label="Check out date"
      name="checkOutDate"
      value={formState.checkOutDate || ''}
      required
      onDateChange={onChange}
    />
  </>
);

ExpenseLodgingFields.propTypes = {
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseLodgingFields;
