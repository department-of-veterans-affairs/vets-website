import React, { useState, useEffect } from 'react';
import environments from 'platform/utilities/environment';

function makeEnvironmentToggleValues(env = environments) {
  return {
    develop: env.isDev(),
    localhost: env.isLocalhost(),
    notProduction: !env.isProduction(),
    staging: env.isStaging(),
    production: env.isProduction(),
  };
}

const ToggleContext = React.createContext();

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

const initialToggleValues = makeEnvironmentToggleValues();

const withFeatureToggleProvider = (
  WrappedComponent,
  toggleValues = initialToggleValues,
) => props => (
  <ToggleProvider initialToggleValues={toggleValues}>
    <WrappedComponent {...props} />
  </ToggleProvider>
);

const FeatureToggle = ({ children, ...props }) => {
  const toggles = Object.keys(props);

  return (
    <ToggleContext.Consumer>
      {toggleValues => {
        const showChildren = toggles.find(toggle => {
          if (!toggleValues) {
            // eslint-disable-next-line no-console
            console.warn(
              `ToggleContext has no values. Make sure the ToggleContext was properly initialized.`,
            );
            return false;
          }

          if (!(toggle in toggleValues)) {
            // eslint-disable-next-line no-console
            console.warn(
              `${toggle} toggle not found. Check that toggle name is correct. All toggle keys must be on the ToggleContext.`,
            );
            return false;
          }
          return toggleValues[toggle];
        });
        return showChildren ? children : null;
      }}
    </ToggleContext.Consumer>
  );
};

export { withFeatureToggleProvider, FeatureToggle };
