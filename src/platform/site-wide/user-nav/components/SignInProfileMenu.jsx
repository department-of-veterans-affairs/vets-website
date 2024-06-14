import PropTypes from 'prop-types';
import React from 'react';

import PersonalizationDropDownPanel from './PersonalizationDropDownPanel';
import PersonalizationDropdown from './PersonalizationDropdown';

function SignInProfileMenu({ greeting, clickHandler, isOpen, disabled }) {
  // User icon in authenticated header
  // Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590
  const icon = (
    <svg
      aria-hidden="true"
      focusable="false"
      className="vads-u-display--block vads-u-margin-right--0 medium-screen:vads-u-margin-right--0p5"
      style={{ width: '26px', height: '24px' }} // overrides formation styles
      viewBox="0 2 21 21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#fff"
        d="M12 12c-1.1 0-2.04-.4-2.82-1.18A3.85 3.85 0 0 1 8 8c0-1.1.4-2.04 1.18-2.83A3.85 3.85 0 0 1 12 4c1.1 0 2.04.4 2.82 1.17A3.85 3.85 0 0 1 16 8c0 1.1-.4 2.04-1.18 2.82A3.85 3.85 0 0 1 12 12Zm-8 8v-2.8c0-.57.15-1.09.44-1.56a2.9 2.9 0 0 1 1.16-1.09 13.76 13.76 0 0 1 9.65-1.16c1.07.26 2.12.64 3.15 1.16.48.25.87.61 1.16 1.09.3.47.44 1 .44 1.56V20H4Z"
      />
    </svg>
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
