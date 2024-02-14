import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.VRECounselorNotification,
    label: 'Yes',
  },
  {
    value: pageNames.VAEducationBenefits,
    label: 'No',
  },
];

const VREBenefits = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'Are you receiving Chapter 31 Veteran Readiness and Employment (VR&E) benefits?',
      'form-field-value': value,
    });
    setPageState({ selected: value }, value);
  };
  return (
    <VaRadio
      id="VREBenefits"
      class="vads-u-margin-y--2"
      label="Are you receiving Chapter 31 Veteran Readiness and Employment (VR&E) benefits?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="vre-benefits"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.value : null
          }
          uswds={true}
        />
      ))}
    </VaRadio>
  );
};

export default {
  name: 'VREBenefits',
  component: VREBenefits,
};
