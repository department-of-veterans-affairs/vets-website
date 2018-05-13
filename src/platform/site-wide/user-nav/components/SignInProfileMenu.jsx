import PropTypes from 'prop-types';
import React from 'react';

import DropDownPanel from '@department-of-veterans-affairs/jean-pants/DropDownPanel';
import IconUser from '@department-of-veterans-affairs/jean-pants/IconUser';
import { logout } from '../../../user/authentication/utilities';
import BetaDropdown from './BetaDropdown';

class SignInProfileMenu extends React.Component {
  render() {
    const icon = <IconUser color="#fff"/>;

    const dropDownContents = (
      <ul>
        <li><a href="/profile">Account</a></li>
        <li><a href="#" onClick={logout}>Sign Out</a></li>
      </ul>
    );

    return (
      <DropDownPanel
        buttonText={this.props.greeting}
        clickHandler={this.props.clickHandler}
        id="accountMenu"
        icon={icon}
        isOpen={this.props.isOpen}
        disabled={this.props.disabled}>
        {this.props.isDashboardBeta ? <BetaDropdown/> : dropDownContents}
      </DropDownPanel>
    );
  }
}

SignInProfileMenu.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  cssClass: PropTypes.string,
  greeting: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  disabled: PropTypes.bool
};

SignInProfileMenu.defaultProps = {
  services: []
};

export default SignInProfileMenu;
