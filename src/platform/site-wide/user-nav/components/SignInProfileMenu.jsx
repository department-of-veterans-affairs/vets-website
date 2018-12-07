import PropTypes from 'prop-types';
import React from 'react';
import DropDownPanel from '@department-of-veterans-affairs/formation/DropDownPanel';
import IconUser from '@department-of-veterans-affairs/formation/IconUser';

import LegacyDropdown from './LegacyDropdown';
import PersonalizationDropdown from './PersonalizationDropdown';

import isPersonalizationEnabled from '../../../../applications/personalization/dashboard/isPersonalizationEnabled';

class SignInProfileMenu extends React.Component {
  render() {
    const icon = <IconUser color="#fff" role="presentation" />;

    return (
      <div>
        <div className="show-for-medium-up">
          <DropDownPanel
            buttonText={this.props.greeting}
            clickHandler={this.props.clickHandler}
            id="account-menu"
            icon={icon}
            isOpen={this.props.isOpen}
            disabled={this.props.disabled}
          >
            {isPersonalizationEnabled() ? (
              <PersonalizationDropdown />
            ) : (
              <LegacyDropdown />
            )}
          </DropDownPanel>
        </div>
        <div className="show-for-small-only">
          <DropDownPanel
            buttonText={this.props.greetingMobile}
            clickHandler={this.props.clickHandler}
            id="account-menu"
            icon={icon}
            isOpen={this.props.isOpen}
            disabled={this.props.disabled}
          >
            {isPersonalizationEnabled() ? (
              <PersonalizationDropdown />
            ) : (
              <LegacyDropdown />
            )}
          </DropDownPanel>
        </div>
      </div>
    );
  }
}

SignInProfileMenu.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  cssClass: PropTypes.string,
  greeting: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

SignInProfileMenu.defaultProps = {
  services: [],
};

export default SignInProfileMenu;
