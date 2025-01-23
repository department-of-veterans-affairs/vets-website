import React, { Component } from 'react';
import { connect } from 'react-redux';
import { object, func } from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { fetchProviderDetail } from '../actions';
import LocationMap from '../components/LocationMap';
import LocationAddress from '../components/search-results-items/common/LocationAddress';
import LocationPhoneLink from '../components/search-results-items/common/LocationPhoneLink';
import LocationDirectionsLink from '../components/search-results-items/common/LocationDirectionsLink';
import AppointmentInfo from '../components/AppointmentInfo';
import ProviderDetailBlock from '../components/ProviderDetailBlock';

/**
 * Container component for the CC Provider Detail page
 *
 * (currently Routed at /facilities/provider/{id})
 */
class ProviderDetail extends Component {
  componentDidMount() {
    this.props.fetchProviderDetail(this.props.params.id);
    scrollTo(0);
    focusElement('.va-nav-breadcrumbs');
  }

  componentDidUpdate(prevProps) {
    const justLoaded =
      prevProps.currentQuery.inProgress && !this.props.currentQuery.inProgress;

    if (justLoaded) {
      this.__previousDocTitle = document.title;
      document.title = `${
        this.props.location.attributes.name
      } | Veterans Affairs`;
    }
  }

  componentWillUnmount() {
    document.title = this.__previousDocTitle;
  }

  renderFacilityInfo = () => {
    const { location } = this.props;
    const { name, orgName, website, fax, email } = location.attributes;

    return (
      <div>
        <h1>{name}</h1>
        {orgName && <h2>{orgName}</h2>}
        <div className="p1">
          <p>
            <span>
              <strong>Facility type:</strong> Community provider (in VA’s
              network)
            </span>
          </p>
          <LocationAddress location={location} />
        </div>
        <div>
          <LocationPhoneLink location={location} />
        </div>
        {fax && (
          <div>
            <va-icon icon="fax" size="3" />
            <strong>Fax number:</strong>
            <br />
            {fax}
          </div>
        )}
        {email && (
          <div>
            <va-icon icon="mail" size="3" />
            <strong>Email address:</strong>
            <br />
            <va-link href={`mailto:${email}`} text={email} />
          </div>
        )}
        {website && (
          <div>
            <va-icon icon="language" size="3" />
            <strong>Website:</strong>
            <br />
            <a href={website} rel="noopener noreferrer" target="_blank">
              {website} (opens in a new tab)
            </a>
          </div>
        )}
        <div>
          <LocationDirectionsLink location={location} />
        </div>
        <p className="p1">
          Planning to visit? Please call first as information on this page may
          change.
        </p>
        <ProviderDetailBlock provider={location} />
      </div>
    );
  };

  render() {
    const { location, currentQuery } = this.props;

    if (!location) {
      return null;
      // Shouldn't we render some sort of error message instead?
      // Right now all the user sees is a blank page. How is a dev
      // supposed to quickly understand what the failure was?
    }

    if (currentQuery.inProgress) {
      return (
        <div>
          <va-loading-indicator message="Loading information..." />
        </div>
      );
    }

    return (
      <div className="row location-detail all-details">
        <div className="usa-width-two-thirds medium-8 columns">
          <div>{this.renderFacilityInfo()}</div>
          <div>
            <AppointmentInfo location={location} />
          </div>
        </div>
        <div className="usa-width-one-third medium-4 columns">
          <div>
            <LocationMap info={location} />
            <div className="vads-u-margin-bottom--4">
              <h4 className="highlight">About Community Care</h4>
              <div>
                <a
                  href="https://www.va.gov/COMMUNITYCARE/programs/veterans/VCP/index.asp"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="about-cc-link"
                >
                  What's Community Care and am I eligible? (opens in a new tab)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProviderDetail.propTypes = {
  currentQuery: object.isRequired,
  fetchProviderDetail: func.isRequired,
  params: object.isRequired,
  location: object, // technically req, but comes in off a REST call in didMount
};

const mapStateToProps = state => ({
  location: state.searchResult.selectedResult,
  currentQuery: state.searchQuery,
});

export default connect(
  mapStateToProps,
  { fetchProviderDetail },
)(ProviderDetail);
