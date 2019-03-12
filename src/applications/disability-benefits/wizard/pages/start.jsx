import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';

const getRadio = (group, setPageState, selected) => ({
  nextPageName,
  children,
}) => (
  <label key={nextPageName} htmlFor={`${group}_${nextPageName}`}>
    <input
      type="radio"
      name={group}
      id={`${group}_${nextPageName}`}
      value={nextPageName}
      onChange={() => setPageState({ selected: nextPageName })}
      checked={selected === nextPageName}
    />
    {children}
  </label>
);

const StartPage = ({ setPageState, goForward, goBack, state = {} }) => {
  const Choice = getRadio('start-page-choice', setPageState, state.selected);
  const goToNextPage = () => goForward(state.selected);
  return (
    <div>
      <Choice nextPageName="second">Go to the second page</Choice>
      <Choice nextPageName="third">Go to the third page</Choice>
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
