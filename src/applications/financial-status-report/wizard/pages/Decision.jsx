import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { PAGE_NAMES } from '../constants';

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
        setPageState({ selected: value }, PAGE_NAMES.error);
        break;
      default:
        setPageState({ selected: value }, PAGE_NAMES.disagree);
    }
  };

  return (
    <RadioButtons
      name={`${PAGE_NAMES.decision}-option`}
      label={label}
      id={`${PAGE_NAMES.decision}-option`}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};
export default {
  name: PAGE_NAMES.decision,
  component: Decision,
};
