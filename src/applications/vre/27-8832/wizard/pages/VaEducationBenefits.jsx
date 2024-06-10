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
    value: pageNames.dischargeStatus,
    label: 'No',
  },
];

const EducationBenefits = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'Are you using VA education benefits to go to school?',
      'form-field-value': value,
    });
    setPageState({ selected: value }, value);
  };
  return (
    <VaRadio
      id="VAEducationBenefits"
      class="vads-u-margin-y--2"
      label="Are you using VA education benefits to go to school?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="education-benefits"
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
  name: 'VAEducationBenefits',
  component: EducationBenefits,
};
