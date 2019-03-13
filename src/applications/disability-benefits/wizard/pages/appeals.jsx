import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import Navigation from '../../../static-pages/wizard/Navigation';
import { pageNames } from './pageList';

const options = [
  {
    value: pageNames.fileClaim,
    label:
      'I’m filing a claim for a new condition or for a condition that has gotten worse.',
  },
  {
    value: pageNames.disagreeing,
    label: 'I’m disagreeing with a VA decision on my claim.',
  },
];

const AppealsPage = ({ setPageState, goForward, goBack, state = {} }) => {
  const goToNextPage = () => goForward(state.selected);
  return (
    <div>
      <ErrorableRadioButtons
        name="appeals-page-option"
        label="Are you filing a new claim or are you disagreeing with a VA decision on a prior claim?"
        id="appeals-page-option"
        options={options}
        onValueChange={({ value }) => setPageState({ selected: value })}
        value={{ value: state.selected }}
      />
      <Navigation
        goForward={goToNextPage}
        forwardAllowed={state.selected}
        goBack={goBack}
      />
    </div>
  );
};

export default {
  name: pageNames.appeals,
  component: AppealsPage,
};
