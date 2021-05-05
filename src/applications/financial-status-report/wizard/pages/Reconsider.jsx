import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import recordEvent from 'platform/monitoring/record-event';
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
  name: PAGE_NAMES.reconsider,
  component: Reconsider,
};
