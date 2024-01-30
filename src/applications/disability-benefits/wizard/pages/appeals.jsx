import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';

const label =
  'Are you filing a new claim or are you disagreeing with a VA decision on an earlier claim?';

const options = [
  {
    value: pageNames.fileClaim,
    label:
      'I’m filing a claim for a new condition or for a condition that’s gotten worse.',
  },
  {
    value: pageNames.disagreeFileClaim,
    label: 'I’m disagreeing with a VA decision on my claim.',
  },
];

const AppealsPage = ({ setPageState, state = {} }) => {
  const onValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label': label,
      'form-field-value':
        value === pageNames.fileClaim ? 'new-worse' : 'disagreeing',
    });
    setPageState({ selected: value }, value);
  };
  return (
    <div id={pageNames.appeals} className="vads-u-margin-top--2">
      <VaRadio
        class="vads-u-margin-y--2"
        label={label}
        onVaValueChange={onValueChange}
      >
        {options.map(option => (
          <va-radio-option
            key={option.value}
            name="appeal-type"
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
    </div>
  );
};

export default {
  name: pageNames.appeals,
  component: AppealsPage,
};
