import React from 'react';

import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ExpenseMealFields = ({ formState, onChange }) => (
  <VaTextInput
    label="Where did you purchase the meal?"
    name="vendorName"
    value={formState.vendorName || ''}
    required
    onInput={onChange}
  />
);

ExpenseMealFields.propTypes = {
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseMealFields;
