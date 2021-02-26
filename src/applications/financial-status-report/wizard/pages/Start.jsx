import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from '../constants';

const label = 'What’s this debt related to?';
const options = [
  {
    label: 'VA disability compensation, education, or pension benefits',
    value: pageNames.request,
  },
  {
    label: 'VA health care copays',
    value: pageNames.copays,
  },
  {
    label: 'Separation pay',
    value: pageNames.separation,
  },
  {
    label: 'Attorney fees',
    value: pageNames.attorney,
  },
  {
    label: 'Rogers STEM program',
    value: pageNames.appeals,
  },
  {
    label: 'VET TEC program',
    value: pageNames.appeals,
  },
];

const Start = ({ setPageState, state = {} }) => (
  <RadioButtons
    id={`${pageNames.start}-option`}
    name={`${pageNames.start}-option`}
    label={label}
    options={options}
    value={{ value: state.selected }}
    onValueChange={({ value }) => {
      setPageState({ selected: value }, value);
    }}
  />
);

export default {
  name: pageNames.start,
  component: Start,
};
