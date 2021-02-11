import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
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
  <RadioButtons
    name={`${startingPageName.start}-option`}
    label="Which of these describes you?"
    id={`${startingPageName.start}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(
        setPageState,
        value,
        options,
        'Which of these describes you?',
      )
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: startingPageName.start,
  component: StartPage,
};
