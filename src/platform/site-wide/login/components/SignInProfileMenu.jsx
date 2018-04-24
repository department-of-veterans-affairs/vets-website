import PropTypes from 'prop-types';
import React from 'react';

import DropDown from '../../../../js/common/components/DropDown';
import IconUser from '../../../../js/common/components/svgicons/IconUser';
import { features } from '../../../../js/personalization/beta-enrollment/containers/BetaApp';
import { logout } from '../utils/helpers';
import BetaDropdown from './BetaDropdown';

class SignInProfileMenu extends React.Component {
  render() {
    const isBeta = this.props.isUserRegisteredForBeta && this.props.isUserRegisteredForBeta(features.dashboard);
    const icon = <IconUser color="#fff"/>;

    const dropDownContents = (
      <ul>
        <li><a href="/profile">Account</a></li>
        <li><a href="#" onClick={logout}>Sign Out</a></li>
      </ul>
    );

    return (
      <DropDown
        buttonText={this.props.greeting}
        clickHandler={this.props.clickHandler}
        contents={isBeta ? <BetaDropdown/> : dropDownContents}
        id="accountMenu"
        icon={icon}
        isOpen={this.props.isOpen}
        disabled={this.props.disabled}/>
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
