import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import { useFeatureToggle } from '../hooks/useFeatureToggle';

const ToggleContext = createContext();
ToggleContext.displayName = 'ToggleContext';

const useToggle = () => {
  return useContext(ToggleContext);
};

export const Toggler = ({ toggleName, children }) => {
  const { useToggleValue } = useFeatureToggle();
  const toggleValue = useToggleValue(toggleName);
  return (
    <ToggleContext.Provider
      value={toggleValue === undefined ? false : toggleValue}
    >
      {children}
    </ToggleContext.Provider>
  );
};

Toggler.propTypes = {
  children: PropTypes.node.isRequired,
  toggleName: PropTypes.string.isRequired,
};

const Enabled = ({ children }) => {
  const toggleValue = useToggle();
  return toggleValue ? children : null;
};

Enabled.propTypes = {
  children: PropTypes.node.isRequired,
};

const Disabled = ({ children }) => {
  const toggleValue = useToggle();
  return toggleValue ? null : children;
};

Disabled.propTypes = {
  children: PropTypes.node.isRequired,
};

Toggler.Enabled = Enabled;
Toggler.Disabled = Disabled;
Toggler.TOGGLE_NAMES = TOGGLE_NAMES;
