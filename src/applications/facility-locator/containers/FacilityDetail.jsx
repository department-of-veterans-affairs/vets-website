import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { fetchVAFacility } from '../actions';
import { focusElement } from '../../../platform/utilities/ui';
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
  // eslint-disable-next-line
  UNSAFE_componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id);
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs');
  }

  componentDidUpdate(prevProps) {
    const justLoaded =
      prevProps.currentQuery.inProgress && !this.props.currentQuery.inProgress;

    if (justLoaded) {
      this.__previousDocTitle = document.title;
      document.title = `${
        this.props.facility.attributes.name
      } | Veterans Affairs`;
    }
  }

  componentWillUnmount() {
    document.title = this.__previousDocTitle;
  }

  showOperationStatus(operationStatus, website) {
    if (!operationStatus) {
      return null;
    }
    let operationStatusTitle;
    let alertClass;
    if (operationStatus === 1) {
      operationStatusTitle = 'Facility notice';
      alertClass = 'info';
    }
    if (operationStatus === 2) {
      operationStatusTitle = 'Limited services and hours';
      alertClass = 'warning';
    }
    if (operationStatus === 3) {
      operationStatusTitle = 'Facility Closed';
      alertClass = 'error';
    }
    return (
      <AlertBox
        headline={`${operationStatusTitle}`}
        content={
          <div>
            <p>
              Operating status text, 300 character limit. Aenean laoreet ac dui
              non pretium. Nullam at mauris cursus ipsum sagittis venenatis.
              Cras vitae maximus orci, in laoreet risus. Phasellus Phasellus vel
              tempor elit. Duis id gravida leo. Curabitur ex eleifend quis
              turpis at, pharetra viverra fusce.
            </p>
            {/* Will remove this logic before merging */}
            {website ||
              (true && (
                <p>
                  Visit the <a href={website || 'http://va.gov'}>website</a> to
                  learn more about hours
                </p>
              ))}
          </div>
        }
        status={`${alertClass}`}
      />
    );
  }

  renderFacilityInfo() {
    const { facility } = this.props;
    const { name, website, phone, operationStatus } = facility.attributes;

    return (
      <div>
        <h1>{name}</h1>
        {this.showOperationStatus(operationStatus, website)}
        <div className="p1">
          <FacilityTypeDescription location={facility} />
          <LocationAddress location={facility} />
        </div>
        <div>
          <LocationPhoneLink location={facility} from={'FacilityDetail'} />
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
          <LocationDirectionsLink location={facility} from={'FacilityDetail'} />
        </div>
        {phone &&
          phone.main && (
            <p className="p1">
              Planning to visit? Please call first as information on this page
              may change.
            </p>
          )}
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
