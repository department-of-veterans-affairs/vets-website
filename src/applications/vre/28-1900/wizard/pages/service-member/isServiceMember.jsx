import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesHonorableDischargeSM, label: 'Yes' },
  { value: serviceMemberPathPageNames.noHonorableDischargeSM, label: 'No' },
];

const isServiceMember = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${serviceMemberPathPageNames.isServiceMember}-option`}
    label="Do you expect to receive an honorable discharge?"
    id={`${serviceMemberPathPageNames.isServiceMember}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(
        setPageState,
        value,
        options,
        'Do you expect to receive an honorable discharge?',
      )
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: serviceMemberPathPageNames.isServiceMember,
  component: isServiceMember,
};
