import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import Navigation from '../../../static-pages/wizard/Navigation';
import { pageNames } from './pageList';

const options = [
  { value: pageNames.fileOriginalClaim, label: 'Yes' },
  { value: pageNames.appeals, label: 'No' },
];

const OriginalClaimPage = ({ setPageState, goForward, goBack, state = {} }) => {
  const goToNextPage = () => goForward(state.selected);
  return (
    <div>
      <ErrorableRadioButtons
        name="start-page-option"
        label="Is this your first time filing a claim with VA?"
        id="start-page-option"
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
  name: pageNames.originalClaim,
  component: OriginalClaimPage,
};
