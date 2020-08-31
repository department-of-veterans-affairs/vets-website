import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.startForm,
    label: 'Yes',
  },
  {
    value: pageNames.applyLaterNotification,
    label: 'No',
  },
];

const BeginFormNow = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name="begin-form-now"
    label="Would you like to apply for career planning and guidance benefits now?"
    options={options}
    id="begin-form-now"
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: 'beginFormNow',
  component: BeginFormNow,
};
