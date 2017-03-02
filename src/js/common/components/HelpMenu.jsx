import React from 'react';
import DropDown from './DropDown';
import IconHelp from './svgicons/IconHelp';

class HelpMenu extends React.Component {
  render() {
    const icon = <IconHelp color="#fff"/>;

    const dropDownContents = (
      <div>
        <p><b>Call the Vets.gov Help Desk</b></p>
        <p><a href="tel:18555747286">1-855-574-7286</a></p>
        <p>Monday &ndash; Friday</p>
        <p>8:00am &ndash; 8:00pm <abbr title="Eastern Time">ET</abbr></p>
      </div>
    );

    return (
      <DropDown
          cssClass={this.props.cssClass}
          buttonText="Help"
          contents={dropDownContents}
          id="helpmenu"
          icon={icon}
          isOpen={false}/>
    );
  }
}

HelpMenu.propTypes = {
  cssClass: React.PropTypes.string
};

export default HelpMenu;
