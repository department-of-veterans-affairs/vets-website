import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.startForm,
    label: 'Yes',
  },
  {
    value: pageNames.applyLaterNotification,
    label: 'No',
  },
];

const BeginFormNow = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ value }) => {
    recordEvent({
      event: `howToWizard-formChange`,
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'Would you like to apply for career planning and guidance benefits now?',
      'form-field-value': value,
    });
    setPageState({ selected: value }, value);
  };
  return (
    <ErrorableRadioButtons
      name="begin-form-now"
      label="Would you like to apply for career planning and guidance benefits now?"
      options={options}
      id="begin-form-now"
      onValueChange={handleValueChange}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: 'beginFormNow',
  component: BeginFormNow,
};
