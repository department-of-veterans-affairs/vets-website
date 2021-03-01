import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'How do you want us to reconsider the decision?';
const options = [
  {
    value: pageNames.error,
    label:
      'I want to ask the Committee of Waivers and Compromises to reconsider my waiver.',
  },
  {
    value: pageNames.copays,
    label: 'I want appeal the decision with the board of Veterans Appeals.',
    // https://www.va.gov/decision-reviews/board-appeal/
  },
];

const Reconsider = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.decision}-option`}
    label={label}
    id={`${pageNames.decision}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.reconsider,
  component: Reconsider,
};
