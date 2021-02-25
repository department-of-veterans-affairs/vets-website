import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'Which of these best describes the person who has this debt?';
const options = [
  {
    value: pageNames.copays,
    label: 'Active duty service member',
  },
  {
    value: pageNames.submit,
    label: 'Veteran',
  },
  {
    value: pageNames.copays,
    label: 'Member of the National Guard or Reserve',
  },
  {
    value: pageNames.copays,
    label: 'Spouse',
  },
  {
    value: pageNames.copays,
    label: 'Dependent',
  },
];

const Recipients = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.recipients}-option`}
    label={label}
    id={`${pageNames.recipients}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.recipients,
  component: Recipients,
};
