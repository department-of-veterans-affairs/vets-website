import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

const options = [
  {
    value: 'chapter31Notification',
    label: 'Yes',
  },
  {
    value: 'VREBenefits',
    label: 'No',
  },
];

const DisabilityRating = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name="disability-rating"
    label="Do you have a service-connected disability or a memorandum (pre-discharge) rating, or are you participating in the Integrated Disability Evaluation System (IDES) process?"
    options={options}
    id="disability-rating"
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: 'isVeteranOrServiceMember',
  component: DisabilityRating,
};
