import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const options = [
  { value: serviceMemberPathPageNames.yesIDES, label: 'Yes' },
  { value: serviceMemberPathPageNames.noIDES, label: 'No' },
];

const noVaMemorandum = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${serviceMemberPathPageNames.noVaMemorandum}-option`}
    label={
      <p>
        Are you in the Integrated Disability Evaluation System (IDES)
        <strong>or</strong> going through Physical Evaluation Board process?
      </p>
    }
    id={`${serviceMemberPathPageNames.noVaMemorandum}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: serviceMemberPathPageNames.noVaMemorandum,
  component: noVaMemorandum,
};
