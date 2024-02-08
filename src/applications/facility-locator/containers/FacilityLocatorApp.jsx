import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import appendQuery from 'append-query';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { validateIdString } from '../utils/helpers';

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
      <Link to={appendQuery('/', searchQueryObj)} key="facility-locator">
        Find Locations
      </Link>,
    ];

    if (validateIdString(location.pathname, '/facility') && selectedResult) {
      crumbs.push(
        <li>
          <Link to={`/${selectedResult.id}`} key={selectedResult.id}>
            {selectedResult.attributes?.name}
          </Link>
        </li>,
      );
    } else if (
      validateIdString(location.pathname, '/provider') &&
      selectedResult
    ) {
      crumbs.push(
        <li>
          <Link to={`/${selectedResult.id}`} key={selectedResult.id}>
            Provider Details
          </Link>
        </li>,
      );
    }

    return crumbs;
  }

  render() {
    const { location, selectedResult } = this.props;

    return (
      <div>
        <va-breadcrumbs uswds="false">
          {this.renderBreadcrumbs(location, selectedResult)}
        </va-breadcrumbs>
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
    results: state.searchResult.results,
  };
}

export default connect(
  mapStateToProps,
  null,
)(FacilityLocatorApp);
