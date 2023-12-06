import PropTypes from 'prop-types';
import React from 'react';

import PersonalizationDropDownPanel from './PersonalizationDropDownPanel';
import PersonalizationDropdown from './PersonalizationDropdown';

function SignInProfileMenu({ greeting, clickHandler, isOpen, disabled }) {
  const icon = (
    <i
      className="fa fa-user"
      style={{ fontSize: '15px', marginRight: '0.25rem' }}
    />
  );

  return (
    <div>
      <PersonalizationDropDownPanel
        buttonText={greeting}
        clickHandler={clickHandler}
        cssClass="sign-in-drop-down-panel-button"
        disabled={disabled}
        icon={icon}
        id="account-menu"
        isOpen={isOpen}
      >
        <PersonalizationDropdown />
      </PersonalizationDropDownPanel>
    </div>
  );
}

SignInProfileMenu.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  greeting: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  isOpen: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default SignInProfileMenu;
