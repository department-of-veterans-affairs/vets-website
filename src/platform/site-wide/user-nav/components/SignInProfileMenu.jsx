import PropTypes from 'prop-types';
import React from 'react';
import IconUser from '@department-of-veterans-affairs/component-library/IconUser';

import PersonalizationDropDownPanel from './PersonalizationDropDownPanel';
import PersonalizationDropdown from './PersonalizationDropdown';

function SignInProfileMenu({ greeting, clickHandler, isOpen, disabled }) {
  const icon = <IconUser color="#fff" role="presentation" />;

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
