import PropTypes from 'prop-types';
import React from 'react';
import DropDown from '../../common/components/DropDown';
import IconUser from '../../common/components/svgicons/IconUser';
import { features } from '../../common/containers/BetaApp';
import DashboardRedirect from '../../common/components/DashboardRedirect';

class SignInProfileMenu extends React.Component {
  render() {
    const icon = <IconUser color="#fff"/>;
    const betaProfile = this.props.isUserRegisteredForBeta(features.dashboard);
    const dropDownContents = (
      <ul>
        {betaProfile && <li><a href="/dashboard-beta"><DashboardRedirect/> Dashboard</a></li>}
        {betaProfile && <li><a href="/profile-beta">Profile</a></li>}
        {betaProfile && <li><a href="/settings-beta">Settings</a></li>}
        {!betaProfile && <li><a href="/profile">Profile</a></li>}
        <li><a href="#" onClick={this.props.onUserLogout}>Sign Out</a></li>
      </ul>
    );

    return (
      <DropDown
        buttonText={this.props.greeting}
        clickHandler={this.props.clickHandler}
        contents={dropDownContents}
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
  onUserLogout: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

SignInProfileMenu.defaultProps = {
  services: []
};

export default SignInProfileMenu;
