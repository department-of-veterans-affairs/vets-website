import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { PAGE_NAMES } from '../constants';

const label = 'How do you want us to reconsider the decision?';
const options = [
  {
    value: PAGE_NAMES.waivers,
    label:
      'I want to ask the Committee of Waivers and Compromises to reconsider my waiver.',
  },
  {
    value: PAGE_NAMES.appeals,
    label: 'I want appeal the decision with the board of Veterans Appeals.',
  },
];

const Reconsider = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${PAGE_NAMES.decision}-option`}
    label={label}
    id={`${PAGE_NAMES.decision}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: PAGE_NAMES.reconsider,
  component: Reconsider,
};
