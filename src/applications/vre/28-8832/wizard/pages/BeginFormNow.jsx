import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

const options = [
  {
    value: 'startForm',
    label: 'Yes',
  },
  {
    value: 'applyLaterNotification',
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
