import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
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
  const handleValueChange = ({ value }) => {
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
    <RadioButtons
      name="vre-benefits"
      label="Are you receiving Chapter 31 Veteran Readiness and Employment (VR&E) benefits?"
      options={options}
      id="vre-benefits"
      onValueChange={value => handleValueChange(value)}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: 'VREBenefits',
  component: VREBenefits,
};
