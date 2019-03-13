import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import Navigation from '../../../static-pages/wizard/Navigation';
import { pageNames } from './pageList';

const options = [
  { value: pageNames.appeals, label: 'Yes' },
  { value: pageNames.bdd, label: 'No' },
];

const StartPage = ({ setPageState, goForward, goBack, state = {} }) => {
  const goToNextPage = () => goForward(state.selected);
  return (
    <div>
      <ErrorableRadioButtons
        name="start-page-option"
        label="Have you separated from your military or uniformed service?"
        id="start-page-option"
        options={options}
        onValueChange={({ value }) => setPageState({ selected: value })}
        value={{ value: state.selected }}
      />
      <Navigation
        noBackButton
        goForward={goToNextPage}
        forwardAllowed={state.selected}
        goBack={goBack}
      />
    </div>
  );
};

export default {
  name: pageNames.start,
  component: StartPage,
};
