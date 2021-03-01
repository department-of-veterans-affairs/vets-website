import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'What do you want to do for this debt?';
const options = [
  {
    value: pageNames.payment,
    label: 'Make a payment on a debt',
  },
  {
    value: pageNames.descision,
    label: 'Report an error or a disagreement with a VA decision',
  },
  {
    value: pageNames.recipients,
    label: 'Request debt relief (a waiver or compromise offer)',
  },
  {
    value: pageNames.repayment,
    label: 'Request an extended monthly payment plan',
  },
  {
    value: pageNames.appeals,
    label: 'Ask VA to reconsider the decision on my waiver request',
  },
];

const Request = ({ setPageState, state = {} }) => (
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
  name: pageNames.request,
  component: Request,
};
