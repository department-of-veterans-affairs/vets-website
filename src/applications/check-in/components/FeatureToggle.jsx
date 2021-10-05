import React from 'react';

const FeatureContext = React.createContext();
FeatureContext.displayName = 'FeatureContext';

function useFeatureToggleContext() {
  return React.useContext(FeatureContext);
}

export default function FeatureToggle({ on, children }) {
  return (
    <FeatureContext.Provider value={on}>{children}</FeatureContext.Provider>
  );
}

export function FeatureOn({ children }) {
  const on = useFeatureToggleContext();
  return on ? children : null;
}

export function FeatureOff({ children }) {
  const on = useFeatureToggleContext();
  return on ? null : children;
}
