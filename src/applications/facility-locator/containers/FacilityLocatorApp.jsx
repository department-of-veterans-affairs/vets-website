/* eslint-disable prettier/prettier */
import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import DowntimeNotification, {
  externalServices,
} from '../../../platform/monitoring/DowntimeNotification';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';
import { ccLocatorEnabled } from '../config';
import appendQuery from 'append-query';

class FacilityLocatorApp extends React.Component {
  buildSearchString() {
    const searchQueryUrl = appendQuery('/', this.props.location.query);
    return searchQueryUrl;
  }

  renderBreadcrumbs(location, selectedResult) {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <Link to={this.buildSearchString()}key="facility-locator">Find Facilities & Services</Link>,
    ];

    if (location.pathname.match(/facility\/[a-z]+_\d/) && selectedResult) {
      crumbs.push(<Link to={`/${selectedResult.id}`} key={selectedResult.id}>Facility Details</Link>);
    } else if (ccLocatorEnabled() && location.pathname.match(/provider\/[a-z]+_\d/) && selectedResult) {
      // TODO: Remove feature flag when ready to go live
      crumbs.push(<Link to={`/${selectedResult.id}`} key={selectedResult.id}>Provider Details</Link>);
    }

    return crumbs;
  }

  render() {
    const { location, selectedResult } = this.props;

    return (
      <div>
        <Breadcrumbs selectedFacility={selectedResult}>
          {this.renderBreadcrumbs(location, selectedResult)}
        </Breadcrumbs>
        <div className="row">
          <DowntimeNotification
            appTitle="facility locator tool"
            dependencies={[externalServices.arcgis]}
          >
            <div className="facility-locator">{this.props.children}</div>
          </DowntimeNotification>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedResult: state.searchResult.selectedResult,
  };
}

export default connect(
  mapStateToProps,
  null,
)(FacilityLocatorApp);
