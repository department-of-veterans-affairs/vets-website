import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';

const label = 'How much time do you need to repay the debt?';
const options = [
  {
    value: PAGE_NAMES.lessThan,
    label: '5 years or less',
  },
  {
    value: PAGE_NAMES.recipients,
    label: 'More than 5 years',
  },
];

const Repayment = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${PAGE_NAMES.decision}-option`}
    label={label}
    id={`${PAGE_NAMES.decision}-option`}
    options={options}
    value={{ value: state.selected }}
    onValueChange={({ value }) => {
      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': label,
        'form-field-value': value,
      });
      setPageState({ selected: value }, value);
    }}
  />
);

export default {
  name: PAGE_NAMES.repayment,
  component: Repayment,
};
