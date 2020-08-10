import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { veteranPathPageNames } from '../pageList';

const options = [
  { value: veteranPathPageNames.yesHonorableDischarge, label: 'Yes' },
  { value: veteranPathPageNames.noHonorableDischarge, label: 'No' },
];

const isVeteran = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${veteranPathPageNames.isVeteran}-option`}
    label={
      <p>
        Did you receive an <strong>other than</strong> dishonorable discharge?
      </p>
    }
    id={`${veteranPathPageNames.isVeteran}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: veteranPathPageNames.isVeteran,
  component: isVeteran,
};
