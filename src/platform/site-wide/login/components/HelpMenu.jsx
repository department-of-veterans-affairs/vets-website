import PropTypes from 'prop-types';
import React from 'react';

import IconHelp from '@department-of-veterans-affairs/jean-pants/IconHelp';
import DropDown from '../../../../js/common/components/DropDown';

class HelpMenu extends React.Component {
  render() {
    const icon = <IconHelp color="#fff"/>;

    const dropDownContents = (
      <div>
        <p><b>Call the Vets.gov Help Desk</b></p>
        <p><a href="tel:18555747286">1-855-574-7286</a></p>
        <p>TTY: <a href="tel:+18008778339">1-800-877-8339</a></p>
        <p>Monday &ndash; Friday, 8:00 a.m. &ndash; 8:00 p.m. (ET)</p>
      </div>
    );

    return (
      <DropDown
        buttonText="Help"
        clickHandler={this.props.clickHandler}
        cssClass={this.props.cssClass}
        contents={dropDownContents}
        id="helpmenu"
        icon={icon}
        isOpen={this.props.isOpen}/>
    );
  }
}

HelpMenu.propTypes = {
  cssClass: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default HelpMenu;
