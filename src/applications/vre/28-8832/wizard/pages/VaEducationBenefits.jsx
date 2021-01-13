import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
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
  const handleValueChange = ({ value }) => {
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
    <RadioButtons
      name="education-benefits"
      label="Are you using VA education benefits to go to school?"
      options={options}
      id="education-benefits"
      onValueChange={handleValueChange}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: 'VAEducationBenefits',
  component: EducationBenefits,
};
