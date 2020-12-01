import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { veteranPathPageNames } from '../pageList';

const options = [
  { value: veteranPathPageNames.yesActiveDutySeparation, label: 'Yes' },
  { value: veteranPathPageNames.noActiveDutySeparation, label: 'No' },
];

const disabilityRating = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${veteranPathPageNames.disabilityRating}-option`}
    label={
      <p>
        Are you <strong>within 12 years</strong> of separation from active duty
        or first disability rating?
      </p>
    }
    id={`${veteranPathPageNames.disabilityRating}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: veteranPathPageNames.disabilityRating,
  component: disabilityRating,
};
