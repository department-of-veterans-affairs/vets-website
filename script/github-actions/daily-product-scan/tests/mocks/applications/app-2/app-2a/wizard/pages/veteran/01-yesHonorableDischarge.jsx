import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { veteranPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: veteranPathPageNames.yesDisabilityRating, label: 'Yes' },
  { value: veteranPathPageNames.noDisabilityRating, label: 'No' },
];

const yesHonorableDischarge = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${veteranPathPageNames.yesHonorableDischarge}-option`}
    label={
      <p>
        Do you have a service-connected disability rating of{' '}
        <strong>10% or higher</strong>?
      </p>
    }
    id={`${veteranPathPageNames.yesHonorableDischarge}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(
        setPageState,
        value,
        options,
        'Do you have a service-connected disability rating of 10% or higher',
      )
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: veteranPathPageNames.yesHonorableDischarge,
  component: yesHonorableDischarge,
};
