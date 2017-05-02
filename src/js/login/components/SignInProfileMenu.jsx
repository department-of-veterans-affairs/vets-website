import PropTypes from 'prop-types';
import React from 'react';
import DropDown from '../../common/components/DropDown';
import IconUser from '../../common/components/svgicons/IconUser';

class SignInProfileMenu extends React.Component {
  render() {
    const icon = <IconUser color="#fff"/>;

    const dropDownContents = (
      <ul>
        <li><a href="/profile">Account</a></li>
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
          isOpen={this.props.isOpen}/>
    );
  }
}

SignInProfileMenu.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  cssClass: PropTypes.string,
  greeting: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onUserLogout: PropTypes.func.isRequired
};

export default SignInProfileMenu;
