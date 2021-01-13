import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesVaMemorandum, label: 'Yes' },
  { value: serviceMemberPathPageNames.noVaMemorandum, label: 'No' },
];

const yesHonorableDischargeSM = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${serviceMemberPathPageNames.yesHonorableDischargeSM}-option`}
    label={
      <p>
        Do you have a VA memorandum rating of
        <strong> 20% or higher?</strong>
      </p>
    }
    id={`${serviceMemberPathPageNames.yesHonorableDischargeSM}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(
        setPageState,
        value,
        options,
        'Do you have a VA memorandum rating of 20% or higher?',
      )
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: serviceMemberPathPageNames.yesHonorableDischargeSM,
  component: yesHonorableDischargeSM,
};
