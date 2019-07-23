import React, { useState } from 'react';

const testFeatureToggleContext = {
  appGibctLandingPageShowPercent: true,
  appGibctLandingPageShowVideo: false,
};

const testUpdate = () => ({
  appGibctLandingPageShowPercent: false,
  appGibctLandingPageShowVideo: true,
});

const TogglesContext = React.createContext(testFeatureToggleContext);

const withToggleConsumer = TogglesContext.Consumer;
const makeWithToggleProvider = ({
  initialToggleValues = {},
  subscribeToUpdateToggles,
  unsubscribeToUpdateToggles = () => {},
}) => WrappedComponent => {
  const [toggleValues, setToggleValues] = useState(initialToggleValues);

  function handleToggleValuesUpdate(newToggleValues) {
    setToggleValues(newToggleValues);
  }

  useEffect(() => {
    subscribeToUpdateToggles(handleToggleValuesUpdate);

    return () => unsubscribeToUpdateToggles();
  });

  return (
    <TogglesContext.Provider value={toggleValues}>
      <WrappedComponent {...this.props} />
    </TogglesContext.Provider>
  );
};

const withToggleProvider = makeWithToggleProvider({
  subscribeToUpdateToggles: testUpdate,
  initialToggleValues: testFeatureToggleContext,
});

// component that maintains the state of the feature flags
// pushes it as prop value onto the context thing
// subscribes to changes from the client - provides a prop for updating the state
//

TogglesContext.Provider;

export { withToggleConsumer, withToggleProvider };
