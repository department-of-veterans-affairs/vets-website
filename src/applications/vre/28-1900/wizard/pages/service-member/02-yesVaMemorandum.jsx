import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const options = [
  { value: serviceMemberPathPageNames.yesInterestedInHelp, label: 'Yes' },
  { value: serviceMemberPathPageNames.notInterestedInHelp, label: 'No' },
];

const yesVaMemorandum = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${serviceMemberPathPageNames.yesVaMemorandum}-option`}
    label={<p>Are you interested in Veteran Readiness & Employment help?</p>}
    id={`${serviceMemberPathPageNames.yesVaMemorandum}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: serviceMemberPathPageNames.yesVaMemorandum,
  component: yesVaMemorandum,
};
