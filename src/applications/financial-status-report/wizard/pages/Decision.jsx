import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'Which of these issues do you want to report?';
const options = [
  {
    value: 'disagree',
    label: 'I disagree with the VA decision that resulted in this debt.',
  },
  {
    value: 'error',
    label: 'I this this debt is due to an error.',
  },
  {
    value: 'wrong',
    label: 'I think the amout of this debt is wrong.',
  },
];

const Decision = ({ setPageState, state = {} }) => {
  const setState = ({ value }) => {
    switch (value) {
      case 'error':
      case 'wrong':
        setPageState({ selected: value }, pageNames.error);
        break;
      default:
        setPageState({ selected: value }, pageNames.disagree);
    }
  };

  return (
    <RadioButtons
      name={`${pageNames.decision}-option`}
      label={label}
      id={`${pageNames.decision}-option`}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};
export default {
  name: pageNames.decision,
  component: Decision,
};
