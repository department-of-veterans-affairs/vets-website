import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';

const label = 'Are you on active duty right now?';

const options = [
  { value: pageNames.bdd, label: 'Yes' },
  { value: pageNames.appeals, label: 'No' },
];

const StartPage = ({ setPageState, state = {} }) => {
  const onValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label': label,
      'form-field-value': value === pageNames.bdd ? 'yes-bdd' : 'no-appeals',
    });
    setPageState({ selected: value }, value);
  };

  return (
    <VaRadio
      class="vads-u-margin-y--2"
      label={label}
      onVaValueChange={onValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="active-duty"
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
  name: pageNames.start,
  component: StartPage,
};
