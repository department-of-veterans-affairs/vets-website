import React, { useState, useEffect } from 'react';

const testFeatureToggleContext = {
  appGibctLandingPageShowPercent: true,
  appGibctLandingPageShowVideo: false,
};

const testUpdate = () => ({
  appGibctLandingPageShowPercent: false,
  appGibctLandingPageShowVideo: true,
});

const ToggleContext = React.createContext(testFeatureToggleContext);

function ToggleProvider(props) {
  const {
    children,
    initialToggleValues,
    subscribeToUpdateToggles = () => {},
    unsubscribeToUpdateToggles = () => {},
  } = props;

  const [toggleValues, setToggleValues] = useState(initialToggleValues);

  function handleToggleValuesUpdate(newToggleValues) {
    setToggleValues(newToggleValues);
  }

  useEffect(
    () => {
      subscribeToUpdateToggles(handleToggleValuesUpdate);

      return () => unsubscribeToUpdateToggles();
    },
    [toggleValues, subscribeToUpdateToggles, unsubscribeToUpdateToggles],
  );

  return (
    <ToggleContext.Provider value={toggleValues}>
      {children}
    </ToggleContext.Provider>
  );
}

const withToggleProvider = WrappedComponent => props => (
  <ToggleProvider initialToggleValues={testFeatureToggleContext}>
    <WrappedComponent {...props} />
  </ToggleProvider>
);

const Toggle = ({ children, ...props }) => {
  const toggles = Object.keys(props);

  return (
    <ToggleContext.Consumer>
      {toggleValues => {
        const showChildren = toggles.find(toggle => toggleValues[toggle]);
        return showChildren ? children : null;
      }}
    </ToggleContext.Consumer>
  );
};

export { withToggleProvider, Toggle };
