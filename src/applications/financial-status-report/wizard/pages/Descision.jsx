import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'Which of these issues do you want to report?';
const options = [
  {
    value: pageNames.disagree,
    label: 'I disagree with the VA descision that resulted in this debt.',
  },
  {
    value: pageNames.error,
    label: 'I this this debt is due to an error.',
  },
  {
    value: pageNames.copays,
    label: 'I think the amout of this debt is wrong.',
  },
];

const Descision = ({ setPageState, state = {} }) => (
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
  name: pageNames.descision,
  component: Descision,
};
