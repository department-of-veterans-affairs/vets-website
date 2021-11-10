import React from 'react';
import PropTypes from 'prop-types';

const FeatureContext = React.createContext();
FeatureContext.displayName = 'FeatureContext';

function useFeatureToggleContext() {
  return React.useContext(FeatureContext);
}

const FeatureToggle = props => {
  const { children, on } = props;
  return (
    <FeatureContext.Provider value={on}>{children}</FeatureContext.Provider>
  );
};

export function FeatureOn({ children }) {
  const on = useFeatureToggleContext();
  return on ? children : null;
}

export function FeatureOff({ children }) {
  const on = useFeatureToggleContext();
  return on ? null : children;
}

FeatureToggle.propTypes = {
  children: PropTypes.node,
  on: PropTypes.bool,
};

export default FeatureToggle;
