import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { veteranPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: veteranPathPageNames.yesDisabilityRating, label: 'Yes' },
  { value: veteranPathPageNames.noDisabilityRating, label: 'No' },
];

const yesHonorableDischarge = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
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
      handleChangeAndPageSet(setPageState, value, options)
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: veteranPathPageNames.yesHonorableDischarge,
  component: yesHonorableDischarge,
};
