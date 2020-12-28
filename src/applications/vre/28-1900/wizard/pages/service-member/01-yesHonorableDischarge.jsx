import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesVaMemorandum, label: 'Yes' },
  { value: serviceMemberPathPageNames.noVaMemorandum, label: 'No' },
];

const yesHonorableDischargeSM = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
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
      handleChangeAndPageSet(setPageState, value, options)
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: serviceMemberPathPageNames.yesHonorableDischargeSM,
  component: yesHonorableDischargeSM,
};
