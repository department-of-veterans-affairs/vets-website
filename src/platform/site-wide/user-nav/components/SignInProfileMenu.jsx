import PropTypes from 'prop-types';
import React from 'react';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';
import IconUser from '@department-of-veterans-affairs/formation-react/IconUser';

import PersonalizationDropdown from './PersonalizationDropdown';

function SignInProfileMenu({ greeting, clickHandler, isOpen, disabled }) {
  const icon = <IconUser color="#fff" role="presentation" />;

  return (
    <div>
      <DropDownPanel
        buttonText={greeting}
        clickHandler={clickHandler}
        id="account-menu"
        icon={icon}
        isOpen={isOpen}
        disabled={disabled}
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
