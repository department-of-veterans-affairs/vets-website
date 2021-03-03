import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { PAGE_NAMES } from '../constants';

const label = 'What’s this debt related to?';
const options = [
  {
    label: 'VA disability compensation, education, or pension benefits',
    value: 'request',
  },
  {
    label: 'VA health care copays',
    value: 'copays',
  },
  {
    label: 'Separation pay',
    value: 'separation',
  },
  {
    label: 'Attorney fees',
    value: 'attorney',
  },
  {
    label: 'Rogers STEM program',
    value: 'rogers-stem',
  },
  {
    label: 'VET TEC program',
    value: 'vettec',
  },
];

const Start = ({ setPageState, state = {} }) => {
  const setState = ({ value }) => {
    switch (value) {
      case 'copays':
        setPageState({ selected: value }, PAGE_NAMES.copays);
        break;
      case 'separation':
      case 'attorney':
        setPageState({ selected: value }, PAGE_NAMES.benefits);
        break;
      case 'rogers-stem':
        setPageState({ selected: value }, PAGE_NAMES.stem);
        break;
      case 'vettec':
        setPageState({ selected: value }, PAGE_NAMES.vettec);
        break;
      default:
        setPageState({ selected: value }, PAGE_NAMES.request);
    }
  };

  return (
    <RadioButtons
      id={`${PAGE_NAMES.start}-option`}
      name={`${PAGE_NAMES.start}-option`}
      label={label}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: PAGE_NAMES.start,
  component: Start,
};
