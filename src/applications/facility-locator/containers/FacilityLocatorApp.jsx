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
          <div className="vads-u-margin-bottom--3 vads-u-padding--2">
            <a
              id="apply-now-link"
              className="vads-c-action-link--green"
              href="/"
            >
              Apply now
            </a>
          </div>

          <div className="vads-u-margin-bottom--3 vads-u-padding--2">
            <a
              id="apply-now-link"
              className="vads-c-action-link--blue"
              href="/"
            >
              Apply now
            </a>
          </div>
          <div className="vads-u-padding--2 usa-background-dark">
            <a
              id="apply-now-link"
              className="vads-c-action-link--white"
              href="/"
            >
              Apply now
            </a>
          </div>

          <div className="usa-alert usa-alert-info">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">We’re adding your details</h3>
              <p className="usa-alert-text">
                We’ve received your claim and are still adding some of your
                information. Check back soon to see the complete details of your
                claim.
              </p>
            </div>
          </div>

          <div className="usa-alert usa-alert-error">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">We’re adding your details</h3>
              <p className="usa-alert-text">
                We’ve received your claim and are still adding some of your
                information. Check back soon to see the complete details of your
                claim.
              </p>
            </div>
          </div>

          <div className="usa-alert usa-alert-success">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">We’re adding your details</h3>
              <p className="usa-alert-text">
                We’ve received your claim and are still adding some of your
                information. Check back soon to see the complete details of your
                claim.
              </p>
            </div>
          </div>

          <div className="usa-alert usa-alert-warning">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">We’re adding your details</h3>
              <p className="usa-alert-text">
                We’ve received your claim and are still adding some of your
                information. Check back soon to see the complete details of your
                claim.
              </p>
            </div>
          </div>

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
