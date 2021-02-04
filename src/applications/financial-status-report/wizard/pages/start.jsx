import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'What type of debt do you need help with?';
const options = [
  {
    value: pageNames.todo,
    label: 'A compensation, pension, or education debt',
  },
  {
    value: pageNames.appeals,
    label: 'A medical copayment or health care debt',
  },
];

const StartPage = ({ setPageState, state = {} }) => (
  <RadioButtons
    id={`${pageNames.start}-option`}
    name={`${pageNames.start}-option`}
    label={label}
    options={options}
    value={{ value: state.selected }}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
  />
);

export default {
  name: pageNames.start,
  component: StartPage,
};
