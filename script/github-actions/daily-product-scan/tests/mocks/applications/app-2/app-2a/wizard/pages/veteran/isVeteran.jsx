import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { veteranPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: veteranPathPageNames.yesHonorableDischarge, label: 'Yes' },
  { value: veteranPathPageNames.noHonorableDischarge, label: 'No' },
];

const isVeteran = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${veteranPathPageNames.isVeteran}-option`}
    label={
      <p>
        Did you receive a discharge status <strong>other than</strong>{' '}
        dishonorable?
      </p>
    }
    id={`${veteranPathPageNames.isVeteran}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(
        setPageState,
        value,
        options,
        'Did you receive a discharge status other than  dishonorable?',
      )
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: veteranPathPageNames.isVeteran,
  component: isVeteran,
};
