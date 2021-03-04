import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { PAGE_NAMES } from '../constants';

const label = 'How much time do you need to repay the debt?';
const options = [
  {
    value: PAGE_NAMES.lessThan,
    label: '5 years or less',
  },
  {
    value: PAGE_NAMES.recipients,
    label: 'More than 5 years',
  },
];

const Repayment = ({ setPageState, state = {} }) => (
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
  name: PAGE_NAMES.repayment,
  component: Repayment,
};
