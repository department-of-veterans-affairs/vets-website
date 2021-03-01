import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'How much time do you need to repay the debt?';
const options = [
  {
    value: pageNames.lessThan,
    label: '5 years or less',
  },
  {
    value: pageNames.recipients,
    label: 'More than 5 years',
  },
];

const Repayment = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${pageNames.descision}-option`}
    label={label}
    id={`${pageNames.descision}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.repayment,
  component: Repayment,
};
