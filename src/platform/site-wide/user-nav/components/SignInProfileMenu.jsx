import PropTypes from 'prop-types';
import React from 'react';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';
import IconUser from '@department-of-veterans-affairs/formation-react/IconUser';

import PersonalizationDropdown from './PersonalizationDropdown';

class SignInProfileMenu extends React.Component {
  render() {
    const icon = <IconUser color="#fff" role="presentation" />;

    return (
      <div>
        <DropDownPanel
          buttonText={this.props.greeting}
          clickHandler={this.props.clickHandler}
          id="account-menu"
          icon={icon}
          isOpen={this.props.isOpen}
          disabled={this.props.disabled}
        >
          <PersonalizationDropdown />
        </DropDownPanel>
      </div>
    );
  }
}

SignInProfileMenu.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  cssClass: PropTypes.string,
  greeting: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  isOpen: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

SignInProfileMenu.defaultProps = {
  services: [],
};

export default SignInProfileMenu;
