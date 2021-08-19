import PropTypes from 'prop-types';
import React from 'react';
import DropDownPanel from '@department-of-veterans-affairs/component-library/DropDownPanel';
import IconUser from '@department-of-veterans-affairs/component-library/IconUser';

import PersonalizationDropdown from './PersonalizationDropdown';

function SignInProfileMenu({ greeting, clickHandler, isOpen, disabled }) {
  const icon = <IconUser color="#fff" role="presentation" />;

  return (
    <div>
      <DropDownPanel
        buttonText={greeting}
        clickHandler={clickHandler}
        cssClass="sign-in-drop-down-panel-button"
        disabled={disabled}
        icon={icon}
        id="account-menu"
        isOpen={isOpen}
      >
        <PersonalizationDropdown />
      </DropDownPanel>
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
