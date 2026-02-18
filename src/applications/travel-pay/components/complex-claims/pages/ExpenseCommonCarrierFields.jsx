import React from 'react';

import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
} from '../../../constants';

const ExpenseCommonCarrierFields = ({ errors = {}, formState, onChange }) => (
  <>
    <VaRadio
      name="carrierType"
      value={formState.carrierType || ''}
      onVaValueChange={e => onChange(e.detail, 'carrierType')}
      label="Type of transportation"
      required
      {...errors.carrierType && { error: errors.carrierType }}
    >
      {TRANSPORTATION_OPTIONS.map(option => (
        <va-radio-option
          key={option}
          label={option}
          value={option}
          checked={formState.carrierType === option}
          name="common-carrier-type-radio"
        />
      ))}
    </VaRadio>
    <VaRadio
      name="reasonNotUsingPOV"
      onVaValueChange={e => onChange(e.detail, 'reasonNotUsingPOV')}
      value={formState.reasonNotUsingPOV || ''}
      label="Why did you choose to use public transportation?"
      required
      {...errors.reasonNotUsingPOV && { error: errors.reasonNotUsingPOV }}
    >
      {Object.keys(TRANSPORTATION_REASONS).map(key => (
        <va-radio-option
          key={key}
          label={TRANSPORTATION_REASONS[key].label}
          value={key}
          checked={formState.reasonNotUsingPOV === key}
          name="common-carrier-pov-reason-radio"
        />
      ))}
    </VaRadio>
  </>
);

ExpenseCommonCarrierFields.propTypes = {
  errors: PropTypes.object,
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseCommonCarrierFields;
