import PropTypes from 'prop-types';
import React from 'react';

import DropDownPanel from '@department-of-veterans-affairs/formation/DropDownPanel';
import IconHelp from '@department-of-veterans-affairs/formation/IconHelp';

class HelpMenu extends React.Component {
  render() {
    const icon = <IconHelp color="#fff"/>;

    const dropDownContents = (
      <div>
        <p><a href="#">Submit a Help Request</a></p>
        <p><a href="#">Go to VA Help Center</a></p>
        <p><a href="#">Call Us</a></p>
      </div>
    );

    return (
      <DropDownPanel
        buttonText="Contact Us"
        clickHandler={this.props.clickHandler}
        cssClass={this.props.cssClass}
        id="helpmenu"
        icon={icon}
        isOpen={this.props.isOpen}>
        {dropDownContents}
      </DropDownPanel>
    );
  }
}

HelpMenu.propTypes = {
  cssClass: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default HelpMenu;
