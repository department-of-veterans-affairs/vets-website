import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/formation-react/RadioButtons';
import { pageNames } from './pageList';

const options = [
  { value: pageNames.bdd, label: 'Yes' },
  { value: pageNames.appeals, label: 'No' },
];

const StartPage = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.start}-option`}
    label="Are you currently on active duty?"
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.start,
  component: StartPage,
};
