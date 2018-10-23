import PropTypes from 'prop-types';
import React from 'react';

import DropDownPanel from '@department-of-veterans-affairs/formation/DropDownPanel';
import IconHelp from '@department-of-veterans-affairs/formation/IconHelp';
import isBrandConsolidationEnabled from '../../../brand-consolidation/feature-flag';

import facilityLocatorManifest from '../../../../applications/facility-locator/manifest.json';

const FACILITY_LOCATOR_URL = facilityLocatorManifest.rootUrl;

class HelpMenu extends React.Component {
  render() {
    const buttonText = isBrandConsolidationEnabled() ? 'Contact Us' : 'Help';
    const icon = <IconHelp color="#fff" role="presentation" />;
    let dropDownContents;

    if (isBrandConsolidationEnabled()) {
      dropDownContents = (
        <div>
          <p>
            <a href={`${FACILITY_LOCATOR_URL}`}>Find a VA Location</a>
          </p>
          <p>
            <b>Call MyVA311:</b>
          </p>
          <p>
            <a href="tel:18446982311">1-844-698-2311</a>
          </p>
          <p>TTY: 711</p>
        </div>
      );
    } else {
      dropDownContents = (
        <div>
          <p>
            <b>Call the Vets.gov Help Desk</b>
          </p>
          <p>
            <a href="tel:18555747286">1-855-574-7286</a>
          </p>
          <p>
            TTY: <a href="tel:+18008778339">1-800-877-8339</a>
          </p>
          <p>Monday &ndash; Friday, 8:00 a.m. &ndash; 8:00 p.m. (ET)</p>
        </div>
      );
    }

    return (
      <DropDownPanel
        buttonText={buttonText}
        clickHandler={this.props.clickHandler}
        cssClass={this.props.cssClass}
        id="helpmenu"
        icon={icon}
        isOpen={this.props.isOpen}
      >
        {dropDownContents}
      </DropDownPanel>
    );
  }
}

HelpMenu.propTypes = {
  cssClass: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default HelpMenu;
