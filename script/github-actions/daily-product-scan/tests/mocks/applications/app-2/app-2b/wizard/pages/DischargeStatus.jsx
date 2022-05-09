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
    value: pageNames.dischargeNotification,
    label: 'No',
  },
];

const DischargeStatus = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ value }) => {
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'Have you or your sponsor been discharged form active-duty service in the last year, or do you have less than 6 months until discharge?',
      'form-field-value': value,
    });
    setPageState({ selected: value }, value);
  };

  return (
    <RadioButtons
      name="discharge-status"
      label="Have you or your sponsor been discharged form active-duty service in the last year, or do you have less than 6 months until discharge?"
      options={options}
      id="discharge-status"
      onValueChange={handleValueChange}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: 'dischargeStatus',
  component: DischargeStatus,
};
