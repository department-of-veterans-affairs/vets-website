import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from '../pageList';

const options = [
  { value: pageNames.interestedInEmploymentHelp, label: 'Yes' },
  { value: pageNames.notInterestedInEmploymentHelp, label: 'No' },
];

const yesActiveDutySeparation = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.start}-option`}
    label={<p>Are you interested in readiness & employment help?</p>}
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.yesActiveDutySeparation,
  component: yesActiveDutySeparation,
};
