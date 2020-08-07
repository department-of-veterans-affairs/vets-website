import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const options = [
  { value: serviceMemberPathPageNames.yesInterestedInHelp, label: 'Yes' },
  { value: serviceMemberPathPageNames.notInterestedInHelp, label: 'No' },
];

const yesIDES = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${serviceMemberPathPageNames.yesIDES}-option`}
    label={<p>Are you interested in readiness & employment help?</p>}
    id={`${serviceMemberPathPageNames.yesIDES}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: serviceMemberPathPageNames.yesIDES,
  component: yesIDES,
};
