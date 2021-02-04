import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'What do you need to do?';
const options = [
  {
    value: pageNames.fileClaim,
    label: 'Make a payment on a debt',
  },
  {
    value: pageNames.fileClaimEarly,
    label: 'Report a problem with a debt',
  },
  {
    value: pageNames.recipient,
    label: 'Request a compromise or waiver',
  },
  {
    value: pageNames.unableToFileBDD,
    label: 'Request an extended monthly payment plan',
  },
  {
    value: pageNames.appeals,
    label: 'Have a waiver decision reconsidered',
  },
];

const Todo = ({ setPageState, state = {} }) => (
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
  name: pageNames.todo,
  component: Todo,
};
