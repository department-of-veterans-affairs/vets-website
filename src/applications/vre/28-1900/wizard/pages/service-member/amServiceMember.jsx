import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const options = [
  { value: serviceMemberPathPageNames.yesHonorableDischargeSM, label: 'Yes' },
  { value: serviceMemberPathPageNames.noHonorableDischargeSM, label: 'No' },
];

const amServiceMember = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${serviceMemberPathPageNames.amServiceMember}-option`}
    label="Do you expect to receive an honorable discharge?"
    id={`${serviceMemberPathPageNames.amServiceMember}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: serviceMemberPathPageNames.amServiceMember,
  component: amServiceMember,
};
