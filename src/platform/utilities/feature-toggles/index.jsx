import React, { useState, useEffect } from 'react';
import { FlipperClient } from 'platform/utilities/feature-toggles/flipper-client';
import environments from 'platform/utilities/environment';

const { addSubscriberCallback, fetchToggleValues } = new FlipperClient();

function makeEnvironmentToggleValues(env = environments) {
  return {
    develop: env.isDev(),
    localhost: env.isLocalhost(),
    notProduction: !env.isProduction(),
    staging: env.isStaging(),
    production: env.isProduction(),
  };
}

function getBootstrappedToggleValues() {
  return {
    facilityLocatorShowCommunityCares: true,
  };
}

const initialToggleValues = {
  ...makeEnvironmentToggleValues(),
  ...getBootstrappedToggleValues(),
};

let currentToggleValues = initialToggleValues;
const getToggleValues = () => currentToggleValues;

async function connectFeatureToggle(
  dispatch,
  toggleValues = currentToggleValues,
) {
  dispatch({
    type: 'FETCH_TOGGLE_VALUES_STARTED',
    payload: toggleValues,
  });

  const newToggleValues = await fetchToggleValues();

  dispatch({
    type: 'FETCH_TOGGLE_VALUES_SUCCEEDED',
    payload: newToggleValues,
  });
}

addSubscriberCallback(newToggleValues => {
  currentToggleValues = {
    ...currentToggleValues,
    ...newToggleValues,
  };
});

const subscribeToToggleUpdates = callback => addSubscriberCallback(callback);

const ToggleContext = React.createContext();

function ToggleProvider(props) {
  const {
    children,
    providerInitialToggleValues,
    subscribeToUpdateToggles = () => {},
    unsubscribeToUpdateToggles = () => {},
  } = props;

  const [toggleValues, setToggleValues] = useState(providerInitialToggleValues);

  useEffect(
    () => {
      function handleToggleValuesUpdate(newToggleValues) {
        setToggleValues({
          ...toggleValues,
          ...newToggleValues,
        });
      }

      subscribeToUpdateToggles(handleToggleValuesUpdate);

      return () => unsubscribeToUpdateToggles();
    },
    [
      providerInitialToggleValues,
      subscribeToUpdateToggles,
      toggleValues,
      unsubscribeToUpdateToggles,
    ],
  );

  return (
    <ToggleContext.Provider value={toggleValues}>
      {children}
    </ToggleContext.Provider>
  );
}

// refreshToggleValues();

/*
const test = addSubscriberCallback(toggleValues => console.log(`1 ${toggleValues}`));
const test2 = addSubscriberCallback(toggleValues => console.log(`2 ${toggleValues}`));

startPollingToggleValues();

window.setTimeout(() => removeSubscriberCallback(test2), 15000);
window.setTimeout(stopPollingToggleValues, 30000);
*/

const withFeatureToggleProvider = (
  WrappedComponent,
  toggleValues = initialToggleValues,
  subscribeToUpdateToggles = addSubscriberCallback,
) => props => (
  <ToggleProvider
    providerInitialToggleValues={toggleValues}
    subscribeToUpdateToggles={subscribeToUpdateToggles}
  >
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

export {
  connectFeatureToggle,
  FeatureToggle,
  getToggleValues,
  subscribeToToggleUpdates,
  withFeatureToggleProvider,
};
