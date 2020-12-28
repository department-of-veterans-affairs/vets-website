import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import {
  startingPageName,
  veteranPathPageNames,
  serviceMemberPathPageNames,
  otherPathPageNames,
} from './pageList';
import { handleChangeAndPageSet } from './helpers';

const options = [
  { value: veteranPathPageNames.isVeteran, label: 'Veteran' },
  {
    value: serviceMemberPathPageNames.isServiceMember,
    label: 'Current service member',
  },
  { value: otherPathPageNames.isOther, label: 'Neither of these' },
];

const StartPage = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${startingPageName.start}-option`}
    label="Which of these describes you?"
    id={`${startingPageName.start}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(setPageState, value, options)
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: startingPageName.start,
  component: StartPage,
};
