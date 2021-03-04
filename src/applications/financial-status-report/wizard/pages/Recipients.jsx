import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { PAGE_NAMES } from '../constants';

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
        setPageState({ selected: value }, PAGE_NAMES.dependents);
        break;
      default:
        setPageState({ selected: value }, PAGE_NAMES.submit);
    }
  };

  return (
    <RadioButtons
      name={`${PAGE_NAMES.recipients}-option`}
      label={label}
      id={`${PAGE_NAMES.recipients}-option`}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: PAGE_NAMES.recipients,
  component: Recipients,
};
