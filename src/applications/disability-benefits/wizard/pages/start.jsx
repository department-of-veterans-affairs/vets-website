import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import Navigation from '../../../static-pages/wizard/Navigation';

const options = [
  { value: 'second', label: 'The second page' },
  { value: 'third', label: 'The third page' },
];

const StartPage = ({ setPageState, goForward, goBack, state = {} }) => {
  const goToNextPage = () => goForward(state.selected);
  return (
    <div>
      <ErrorableRadioButtons
        name="start-page-option"
        label="What page do you want to go to next?"
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
  name: 'start',
  component: StartPage,
};
