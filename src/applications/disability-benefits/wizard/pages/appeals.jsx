import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

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

const AppealsPage = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.appeals}-option`}
    label={label}
    id={`${pageNames.appeals}-option`}
    options={options}
    onValueChange={({ value }) => {
      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': label,
        'form-field-value':
          value === pageNames.fileClaim ? 'new-worse' : 'disagreeing',
      });
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.appeals,
  component: AppealsPage,
};
