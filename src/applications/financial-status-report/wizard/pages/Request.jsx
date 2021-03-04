import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { PAGE_NAMES } from '../constants';

const label = 'What do you want to do for this debt?';
const options = [
  {
    value: PAGE_NAMES.payment,
    label: 'Make a payment on a debt',
  },
  {
    value: PAGE_NAMES.decision,
    label: 'Report an error or a disagreement with a VA decision',
  },
  {
    value: PAGE_NAMES.recipients,
    label: 'Request debt relief (a waiver or compromise offer)',
  },
  {
    value: PAGE_NAMES.repayment,
    label: 'Request an extended monthly payment plan',
  },
  {
    value: PAGE_NAMES.reconsider,
    label: 'Ask VA to reconsider the decision on my waiver request',
  },
];

const Request = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${PAGE_NAMES.reconsider}-option`}
    label={label}
    id={`${PAGE_NAMES.reconsider}-option`}
    options={options}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
    value={{ value: state.selected }}
  />
);

export default {
  name: PAGE_NAMES.request,
  component: Request,
};
