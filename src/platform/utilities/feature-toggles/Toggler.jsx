import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import TOGGLE_NAMES from './featureFlagNames';
import { useFeatureToggle } from './useFeatureToggle';

const ToggleContext = createContext();
ToggleContext.displayName = 'ToggleContext';

const useToggleContext = () => {
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

const Hoc = ({ toggleName, children }) => {
  const { useToggleValue } = useFeatureToggle();
  const toggleValue = useToggleValue(toggleName);
  return children(toggleValue === undefined ? false : toggleValue);
};

const Enabled = ({ children }) => {
  const toggleValue = useToggleContext();
  return toggleValue ? children : null;
};

Enabled.propTypes = {
  children: PropTypes.node.isRequired,
};

const Disabled = ({ children }) => {
  const toggleValue = useToggleContext();
  return toggleValue ? null : children;
};

Disabled.propTypes = {
  children: PropTypes.node.isRequired,
};

Toggler.Hoc = Hoc;
Toggler.Enabled = Enabled;
Toggler.Disabled = Disabled;
Toggler.TOGGLE_NAMES = TOGGLE_NAMES;
