import PropTypes from 'prop-types';
import React from 'react';

import DropDown from '../../common/components/DropDown';
import IconUser from '../../common/components/svgicons/IconUser';
import { features } from '../../personalization/beta-enrollment/containers/BetaApp';
import BetaDropdown from './BetaDropdown';
import { envIsProd } from '../../personalization/no-prod';

import { logout } from '../utils/helpers';

class SignInProfileMenu extends React.Component {
  render() {
    // @todo Once Personalization goes to production, remove this.
    // This check is unnecessary anyway since if the user accesses the page for enrolling in the beta they'll be
    // redirected before they can press the enroll button. For completeness I'm including the check anyway.
    const isBeta = !envIsProd() && this.props.isUserRegisteredForBeta && this.props.isUserRegisteredForBeta(features.dashboard);
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
