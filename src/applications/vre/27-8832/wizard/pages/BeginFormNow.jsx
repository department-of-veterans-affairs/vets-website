import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';
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
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
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
    <VaRadio
      id="beginFormNow"
      class="vads-u-margin-y--2"
      label="Would you like to apply for career planning and guidance benefits now?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="begin-form-now"
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
  name: 'beginFormNow',
  component: BeginFormNow,
};
