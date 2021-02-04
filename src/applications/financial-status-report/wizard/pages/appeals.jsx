import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'Are you filing a new claim?';
const options = [
  {
    value: pageNames.fileClaim,
    label: 'I’m filing a claim for a new condition for a condition',
  },
  {
    value: pageNames.disagreeFileClaim,
    label: 'I’m disagreeing with a VA decision on my claim',
  },
];

const AppealsPage = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.appeals}-option`}
    label={label}
    id={`${pageNames.appeals}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.appeals,
  component: AppealsPage,
};
