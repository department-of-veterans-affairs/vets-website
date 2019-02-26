import PropTypes from 'prop-types';
import React from 'react';

import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';
import IconHelp from '@department-of-veterans-affairs/formation-react/IconHelp';

import isBrandConsolidationEnabled from '../../../brand-consolidation/feature-flag';
import isVATeamSiteSubdomain from '../../../brand-consolidation/va-subdomain';

import facilityLocatorManifest from '../../../../applications/facility-locator/manifest';

const FACILITY_LOCATOR_URL = facilityLocatorManifest.rootUrl;

class HelpMenu extends React.Component {
  render() {
    const facilityLocatorUrl = isVATeamSiteSubdomain()
      ? `https://www.va.gov${FACILITY_LOCATOR_URL}`
      : FACILITY_LOCATOR_URL;
    const buttonText = isBrandConsolidationEnabled() ? 'Contact Us' : 'Help';
    const icon = <IconHelp color="#fff" role="presentation" />;
    let dropDownContents;

    if (isBrandConsolidationEnabled()) {
      dropDownContents = (
        <div className="va-helpmenu-contents">
          <p>
            <a href={`${facilityLocatorUrl}`}>Find a VA Location</a>
          </p>
          <p>
            <a href="https://iris.custhelp.va.gov/app/ask">Ask a Question</a>
          </p>
          <p>
            <a href="tel:18446982311">Call MyVA311: 1-844-698-2311</a>
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
        id="help-menu"
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
