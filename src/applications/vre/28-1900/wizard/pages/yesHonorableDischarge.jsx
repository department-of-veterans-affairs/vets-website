import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const options = [
  { value: pageNames.disabilityRating, label: 'Yes' },
  { value: pageNames.amServiceMember, label: 'No' },
];

const yesHonorableDischarge = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.start}-option`}
    label={
      <p>
        Do you have a service-connected disability rating of
        <strong>10% or higher</strong>?
      </p>
    }
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.yesHonorableDischarge,
  component: yesHonorableDischarge,
};
