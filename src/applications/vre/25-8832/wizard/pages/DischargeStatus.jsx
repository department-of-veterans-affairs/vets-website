import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.beginFormNow,
    label: 'Yes',
  },
  {
    value: pageNames.dischargeNotification,
    label: 'No',
  },
];

const DischargeStatus = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'Have you or your sponsor been discharged from active-duty service in the last year, or do you have less than 6 months until discharge?',
      'form-field-value': value,
    });
    setPageState({ selected: value }, value);
  };

  return (
    <VaRadio
      id="dischargeStatus"
      class="vads-u-margin-y--2"
      label="Have you or your sponsor been discharged from active-duty service in the last year, or do you have less than 6 months until discharge?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="discharge-status"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.value : null
          }
          uswds={false}
        />
      ))}
    </VaRadio>
  );
};

export default {
  name: 'dischargeStatus',
  component: DischargeStatus,
};
