import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { fetchVAFacility } from '../actions';
import AccessToCare from '../components/AccessToCare';
import LocationAddress from '../components/search-results-items/common/LocationAddress';
import LocationDirectionsLink from '../components/search-results-items/common/LocationDirectionsLink';
import LocationHours from '../components/LocationHours';
import LocationMap from '../components/LocationMap';
import LocationPhoneLink from '../components/search-results-items/common/LocationPhoneLink';
import ServicesAtFacility from '../components/ServicesAtFacility';
import { FacilityType } from '../constants';
import VABenefitsCall from '../components/VABenefitsCall';
import { facilityLocatorShowOperationalHoursSpecialInstructions } from '../utils/featureFlagSelectors';

import OperationStatus from '../components/facility-details/OperationStatus';

class FacilityDetail extends Component {
  headerRef = React.createRef();

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id, null);
    scrollTo(0);
  }

  componentDidUpdate(prevProps) {
    const justLoaded =
      prevProps.currentQuery.inProgress && !this.props.currentQuery.inProgress;

    if (justLoaded) {
      this.__previousDocTitle = document.title;
      document.title = `${
        this.props.facility.attributes.name
      } | Veterans Affairs`;

      // Need to wait until the data is loaded to focus
      this.headerRef.current.focus();
    }
  }

  componentWillUnmount() {
    document.title = this.__previousDocTitle;
  }

  renderFacilityInfo() {
    const { facility } = this.props;
    const {
      name,
      website,
      phone,
      operatingStatus,
      facilityType,
    } = facility.attributes;

    const isVBA = facilityType === FacilityType.VA_BENEFITS_FACILITY;
    return (
      <div>
        <h1 ref={this.headerRef} tabIndex={-1}>
          {name}
        </h1>
        <OperationStatus {...{ operatingStatus, website, facilityType }} />
        <div className="p1">
          <LocationAddress location={facility} />
        </div>
        <div>
          <LocationPhoneLink location={facility} from="FacilityDetail" />
        </div>
        {website &&
          website !== 'NULL' && (
            <>
              <va-icon icon="language" size="3" />
              <va-link href={website} text="Website" />
            </>
          )}
        <div>
          <LocationDirectionsLink location={facility} from="FacilityDetail" />
        </div>
        {phone &&
          phone.main &&
          !isVBA && (
            <p className="p1">
              Planning to visit? Please call first as information on this page
              may change.
            </p>
          )}
        {isVBA && <VABenefitsCall />}
      </div>
    );
  }

  render() {
    const { facility, currentQuery, showHoursSpecialInstructions } = this.props;

    if (!facility) {
      return null;
      // Shouldn't we render some sort of error message instead?
      // Right now all the user sees is a blank page. How is a dev
      // to quickly understand what the failure was?
    }

    if (currentQuery.inProgress) {
      return (
        <div>
          <va-loading-indicator message="Loading information..." />
        </div>
      );
    }

    return (
      <div className="row facility-detail all-details" id="facility-detail-id">
        <div className="usa-width-two-thirds medium-8 columns">
          <div>
            {this.renderFacilityInfo()}
            <ServicesAtFacility facility={facility} />
          </div>
          <div>
            <AccessToCare location={facility} />
          </div>
        </div>
        <div className="usa-width-one-third medium-4 columns">
          <div>
            <LocationMap info={facility} />
            <div className="vads-u-margin-bottom--4">
              <LocationHours
                location={facility}
                showHoursSpecialInstructions={showHoursSpecialInstructions}
              />
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
    showHoursSpecialInstructions: facilityLocatorShowOperationalHoursSpecialInstructions(
      state,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityDetail);

FacilityDetail.propTypes = {
  currentQuery: PropTypes.object,
  facility: PropTypes.object,
  fetchVAFacility: PropTypes.func,
  params: PropTypes.object,
  showHoursSpecialInstructions: PropTypes.bool,
};
