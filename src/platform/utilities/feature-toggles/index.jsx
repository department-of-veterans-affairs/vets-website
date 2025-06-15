// import React, { useState, useEffect } from 'react';
import {
  TOGGLE_VALUES_SET,
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
} from '../../site-wide/feature-toggles/actionTypes';
import environments from '../environment';

import FlipperClient from './flipper-client';
import {
  useFeatureToggle,
  useFormFeatureToggleSync,
  useToggleLoadingValue,
  useToggleValue,
} from './useFeatureToggle';
import { Toggler } from './Toggler';
import TOGGLE_NAMES from './featureFlagNames';

const { fetchToggleValues } = FlipperClient({ host: environments.API_URL });

function makeEnvironmentToggleValues(env = environments) {
  return {
    develop: env.isDev(),
    localhost: env.isLocalhost(),
    notProduction: !env.isProduction(),
    staging: env.isStaging(),
    production: env.isProduction(),
  };
}

// TODO: add helper to that gets loading state of feature toggles

const initialToggleValues = {
  ...makeEnvironmentToggleValues(),
};

let updateFeatureToggleValuesFunc = () => {};

// for use only in tests
const updateFeatureToggleValue = newToggleValues =>
  updateFeatureToggleValuesFunc(newToggleValues);

/**
 * Fetches feature toggle values from the service and updates the redux store
 * generally this is only called once in the app when mounted
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} toggleValues - Initial toggle values
 */
async function connectFeatureToggle(
  dispatch,
  toggleValues = initialToggleValues,
) {
  // create toggle overriding function for tests
  updateFeatureToggleValuesFunc = newToggleValues =>
    dispatch({
      type: TOGGLE_VALUES_SET,
      newToggleValues,
    });

  // set state with default toggle values
  dispatch({
    type: FETCH_TOGGLE_VALUES_STARTED,
    payload: toggleValues,
  });

  // fetch toggle values from service and update state
  const newToggleValues = await fetchToggleValues();

  dispatch({
    type: FETCH_TOGGLE_VALUES_SUCCEEDED,
    payload: newToggleValues,
  });
}

// TODO: remove or refactor
/*
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
*/

export {
  connectFeatureToggle,
  updateFeatureToggleValue,
  useToggleLoadingValue,
  useFormFeatureToggleSync,
  useToggleValue,
  useFeatureToggle,
  Toggler,
  TOGGLE_NAMES,
};
