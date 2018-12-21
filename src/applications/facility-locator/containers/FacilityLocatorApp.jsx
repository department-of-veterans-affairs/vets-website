import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import DowntimeNotification, {
  externalServices,
} from '../../../platform/monitoring/DowntimeNotification';
import buildQueryString from '../../../platform/utilities/data/buildQueryString';
import { validateIdString } from '../utils/helpers';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';
import { ccLocatorEnabled } from '../config';

class FacilityLocatorApp extends React.Component {
  renderBreadcrumbs(location, selectedResult) {
    // Map and name props for the search query object
    const {
      currentPage: page,
      context,
      facilityType,
      searchString: address,
      serviceType,
      zoomLevel,
    } = this.props.searchQuery;

    // Build the query object in the expected order
    const searchQueryObj = {
      zoomLevel,
      page,
      address,
      location: `${location.latitude},${location.longitude}`,
      context,
      facilityType,
      serviceType,
    };

    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <Link to={buildQueryString('/', searchQueryObj)} key="facility-locator">
        Find Facilities & Services
      </Link>,
    ];

    // Matches on all of the following URL shapes.
    // The first item would not match our previous regex,
    // and the breadcrumb would not add a third link.
    //
    // find-locations/facility/nca_s1130
    // find-locations/facility/vha_691GE
    // find-locations/facility/nca_827
    if (validateIdString(location.pathname, '/facility') && selectedResult) {
      crumbs.push(
        <Link to={`/${selectedResult.id}`} key={selectedResult.id}>
          Facility Details
        </Link>,
      );
    } else if (
      ccLocatorEnabled() && // TODO: Remove feature flag when ready to go live
      validateIdString(location.pathname, '/provider') &&
      selectedResult
    ) {
      crumbs.push(
        <Link to={`/${selectedResult.id}`} key={selectedResult.id}>
          Provider Details
        </Link>,
      );
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
