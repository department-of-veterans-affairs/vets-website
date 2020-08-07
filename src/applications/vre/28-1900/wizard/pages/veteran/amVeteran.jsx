import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from '../pageList';

const options = [
  { value: pageNames.yesHonorableDischarge, label: 'Yes' },
  { value: pageNames.noHonorableDischarge, label: 'No' },
];

const amVeteran = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.start}-option`}
    label={
      <p>
        Did you receive an <strong>other than</strong> dishonorable discharge?
      </p>
    }
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.amVeteran,
  component: amVeteran,
};
