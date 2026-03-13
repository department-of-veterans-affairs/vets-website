import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import appendQuery from 'append-query';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
      {
        href: '/',
        label: 'Home',
      },
      {
        href: appendQuery('/', searchQueryObj),
        label: 'Find Locations',
      },
    ];

    if (validateIdString(location.pathname, '/facility') && selectedResult) {
      crumbs.push({
        href: `/${selectedResult.id}`,
        label: selectedResult.attributes?.name,
      });
    } else if (
      validateIdString(location.pathname, '/provider') &&
      selectedResult
    ) {
      crumbs.push({
        href: `/${selectedResult.id}`,
        label: 'Provider Details',
      });
    }

    return crumbs;
  }

  render() {
    const { location, selectedResult } = this.props;

    return (
      <div className="row">
        <div className="facility-locator">
          <VaBreadcrumbs
            uswds
            label="Breadcrumbs"
            breadcrumbList={this.renderBreadcrumbs(location, selectedResult)}
          />
        </div>
        <DowntimeNotification
          appTitle="facility locator tool"
          customText={{ appType: 'tool' }}
          dependencies={[externalServices.arcgis]}
        >
          <div className="facility-locator">{this.props.children}</div>
        </DowntimeNotification>
      </div>
    );
  }
}

FacilityLocatorApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    pathname: PropTypes.string,
  }),
  searchQuery: PropTypes.shape({
    context: PropTypes.string,
    currentPage: PropTypes.number,
    facilityType: PropTypes.string,
    searchString: PropTypes.string,
    serviceType: PropTypes.string,
    zoomLevel: PropTypes.number,
  }),
  selectedResult: PropTypes.shape({
    attributes: PropTypes.shape({
      name: PropTypes.string,
    }),
    id: PropTypes.string,
  }),
};

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
