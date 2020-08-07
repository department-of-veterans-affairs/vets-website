import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from '../pageList';

const options = [
  { value: pageNames.yesActiveDutySeparation, label: 'Yes' },
  { value: pageNames.noActiveDutySeparation, label: 'No' },
];

const disabilityRating = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.start}-option`}
    label={
      <p>
        Are you <strong>within 12 years</strong> of separation from active duty
        or first disability rating?
      </p>
    }
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.disabilityRating,
  component: disabilityRating,
};
