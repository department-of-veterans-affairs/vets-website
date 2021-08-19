import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import recordEvent from 'platform/monitoring/record-event';
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
    value={{ value: state.selected }}
    onValueChange={({ value }) => {
      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': label,
        'form-field-value': value,
      });
      setPageState({ selected: value }, value);
    }}
  />
);

export default {
  name: PAGE_NAMES.request,
  component: Request,
};
