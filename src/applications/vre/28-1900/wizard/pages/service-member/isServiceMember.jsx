import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const options = [
  { value: serviceMemberPathPageNames.yesHonorableDischargeSM, label: 'Yes' },
  { value: serviceMemberPathPageNames.noHonorableDischargeSM, label: 'No' },
];

const isServiceMember = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${serviceMemberPathPageNames.isServiceMember}-option`}
    label="Do you expect to receive an honorable discharge?"
    id={`${serviceMemberPathPageNames.isServiceMember}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: serviceMemberPathPageNames.isServiceMember,
  component: isServiceMember,
};
