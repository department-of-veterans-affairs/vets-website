import React, { useContext, createContext } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toggleValues as toggleValuesSelector } from '~/platform/site-wide/feature-toggles/selectors';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const ToggleContext = createContext();
ToggleContext.displayName = 'ToggleContext';

const useToggle = () => {
  return useContext(ToggleContext);
};

export const Toggler = ({ toggleName, children }) => {
  const toggleValues = useSelector(state => toggleValuesSelector(state));
  const toggleValue = toggleValues?.[toggleName];
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
