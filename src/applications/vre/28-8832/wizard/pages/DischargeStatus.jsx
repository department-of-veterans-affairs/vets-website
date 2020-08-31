import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.beginFormNow,
    label: 'Yes',
  },
  {
    value: pageNames.dischargeNotification,
    label: 'No',
  },
];

const DischargeStatus = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name="discharge-status"
    label="Have you or your sponsor been discharged form active-duty service in the last year, or do you have less than 6 months until discharge?"
    options={options}
    id="discharge-status"
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: 'dischargeStatus',
  component: DischargeStatus,
};
