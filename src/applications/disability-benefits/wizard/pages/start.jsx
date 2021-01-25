import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';

const label = 'Are you on active duty right now?';

const options = [
  { value: pageNames.bdd, label: 'Yes' },
  { value: pageNames.appeals, label: 'No' },
];

const StartPage = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.start}-option`}
    label={label}
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => {
      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': label,
        'form-field-value': value === pageNames.bdd ? 'yes-bdd' : 'no-appeals',
      });
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.start,
  component: StartPage,
};
