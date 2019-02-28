import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchVAFacility } from '../actions';
import AccessToCare from '../components/AccessToCare';
import LocationAddress from '../components/search-results/LocationAddress';
import LocationDirectionsLink from '../components/search-results/LocationDirectionsLink';
import LocationHours from '../components/LocationHours';
import LocationMap from '../components/LocationMap';
import LocationPhoneLink from '../components/search-results/LocationPhoneLink';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import ServicesAtFacility from '../components/ServicesAtFacility';
import AppointmentInfo from '../components/AppointmentInfo';
import FacilityTypeDescription from '../components/FacilityTypeDescription';

class FacilityDetail extends Component {
  componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id);
    window.scrollTo(0, 0);
  }

  renderFacilityInfo() {
    const { facility } = this.props;
    const { name, website } = facility.attributes;

    return (
      <div>
        <h1>{name}</h1>
        <div className="p1">
          <FacilityTypeDescription location={facility} />
          <LocationAddress location={facility} />
        </div>
        <div>
          <LocationPhoneLink location={facility} />
        </div>
        {website &&
          website !== 'NULL' && (
            <span>
              <a href={website} target="_blank" rel="noopener noreferrer">
                <i className="fa fa-globe" />
                Website
              </a>
            </span>
          )}
        <div>
          <LocationDirectionsLink location={facility} />
        </div>
        <p className="p1">
          Planning to visit? Please call first as information on this page may
          change.
        </p>
      </div>
    );
  }

  render() {
    const { facility, currentQuery } = this.props;

    if (!facility) {
      return null;
      // Shouldn't we render some sort of error message instead?
      // Right now all the user sees is a blank page. How is a dev
      // to quickly understand what the failure was?
    }

    if (currentQuery.inProgress) {
      return (
        <div>
          <LoadingIndicator message="Loading information..." />
        </div>
      );
    }

    return (
      <div className="row facility-detail all-details">
        <div className="usa-width-two-thirds medium-8 columns">
          <div>
            {this.renderFacilityInfo()}
            <ServicesAtFacility facility={facility} />
          </div>
          <div>
            <AppointmentInfo location={facility} />
            <AccessToCare location={facility} />
          </div>
        </div>
        <div className="usa-width-one-third medium-4 columns">
          <div>
            <LocationMap info={facility} />
            <div className="mb2">
              <LocationHours location={facility} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchVAFacility }, dispatch);
}

function mapStateToProps(state) {
  return {
    facility: state.searchResult.selectedResult,
    currentQuery: state.searchQuery,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityDetail);
