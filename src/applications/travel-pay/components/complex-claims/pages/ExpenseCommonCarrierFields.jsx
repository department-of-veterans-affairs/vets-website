import React from 'react';

import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
} from '../../../constants';

const ExpenseCommonCarrierFields = ({ formState, onChange }) => (
  <>
    <VaRadio
      name="transportationType"
      value={formState.transportationType || ''}
      onVaValueChange={e => onChange(e.detail, 'transportationType')}
      label="Type of transportation"
      required
    >
      {TRANSPORTATION_OPTIONS.map(option => (
        <va-radio-option
          key={option}
          label={option}
          value={option}
          checked={formState.transportationType === option}
        />
      ))}
    </VaRadio>
    <VaRadio
      name="transportationReason"
      onVaValueChange={e => onChange(e.detail, 'transportationReason')}
      value={formState.transportationReason || ''}
      label="Why did you choose to use public transportation?"
      required
    >
      {Object.keys(TRANSPORTATION_REASONS).map(key => (
        <va-radio-option
          key={key}
          label={TRANSPORTATION_REASONS[key].label}
          value={key}
          checked={formState.transportationReason === key}
        />
      ))}
    </VaRadio>
  </>
);

ExpenseCommonCarrierFields.propTypes = {
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseCommonCarrierFields;
