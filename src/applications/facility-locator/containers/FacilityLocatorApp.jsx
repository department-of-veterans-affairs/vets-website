/* eslint-disable prettier/prettier */
import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';
import { ccLocatorEnabled } from '../config';
import appendQuery from 'append-query';

class FacilityLocatorApp extends React.Component {
  // TODO: Move this logic into a shared helper so it can be
  // reused on VAMap.jsx and other places we want to build
  // complex URL strings.
  buildSearchString() {
    const {
      currentPage: page,
      context,
      facilityType,
      position: location,
      searchString: address,
      serviceType,
      zoomLevel,
    } = this.props.searchQuery;

    const searchQuery = {
      zoomLevel,
      page,
      address,
      location: `${location.latitude},${location.longitude}`,
      context,
      facilityType,
      serviceType,
    };

    const searchQueryUrl = appendQuery('/', searchQuery);
    return searchQueryUrl;
  }

  renderBreadcrumbs(location, selectedResult) {
    const crumbs = [
      <a href="/" key="home">Home</a>,
      <Link to={this.buildSearchString()} key="facility-locator">Find Facilities & Services</Link>,
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
    searchQuery: state.searchQuery,
  };
}

export default connect(
  mapStateToProps,
  null,
)(FacilityLocatorApp);
