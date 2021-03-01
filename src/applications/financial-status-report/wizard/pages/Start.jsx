import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

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
        setPageState({ selected: value }, pageNames.copays);
        break;
      case 'separation':
      case 'attorney':
        setPageState({ selected: value }, pageNames.benefits);
        break;
      case 'rogers-stem':
        setPageState({ selected: value }, pageNames.stem);
        break;
      case 'vettec':
        setPageState({ selected: value }, pageNames.vettec);
        break;
      default:
        setPageState({ selected: value }, pageNames.request);
    }
  };

  return (
    <RadioButtons
      id={`${pageNames.start}-option`}
      name={`${pageNames.start}-option`}
      label={label}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: pageNames.start,
  component: Start,
};
