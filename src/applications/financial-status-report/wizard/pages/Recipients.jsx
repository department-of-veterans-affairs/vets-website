import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'Which of these best describes the person who has this debt?';
const options = [
  {
    value: 'active-duty',
    label: 'Active duty service member',
  },
  {
    value: 'veteran',
    label: 'Veteran',
  },
  {
    value: 'national-guard',
    label: 'Member of the National Guard or Reserve',
  },
  {
    value: 'spouse',
    label: 'Spouse',
  },
  {
    value: 'dependent',
    label: 'Dependent',
  },
];

const Recipients = ({ setPageState, state = {} }) => {
  const setState = ({ value }) => {
    switch (value) {
      case 'spouse':
      case 'dependent':
        setPageState({ selected: value }, pageNames.copays);
        break;
      default:
        setPageState({ selected: value }, pageNames.submit);
    }
  };

  return (
    <RadioButtons
      name={`${pageNames.recipients}-option`}
      label={label}
      id={`${pageNames.recipients}-option`}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: pageNames.recipients,
  component: Recipients,
};
