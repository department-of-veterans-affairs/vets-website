import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { veteranPathPageNames } from '../pageList';

const options = [
  { value: veteranPathPageNames.interestedInEmploymentHelp, label: 'Yes' },
  { value: veteranPathPageNames.notInterestedInEmploymentHelp, label: 'No' },
];

const yesActiveDutySeparation = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${veteranPathPageNames.yesActiveDutySeparation}-option`}
    label={<p>Are you interested in Veteran Readiness & Employment help?</p>}
    id={`${veteranPathPageNames.yesActiveDutySeparation}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: veteranPathPageNames.yesActiveDutySeparation,
  component: yesActiveDutySeparation,
};
