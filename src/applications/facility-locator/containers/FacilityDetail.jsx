import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { scrollTo } from 'platform/utilities/scroll';
import { fetchVAFacility } from '../actions/locations';
import AccessToCare from '../components/AccessToCare';
import FacilityInfo from '../components/facility-details/FacilityInfo';
import LocationHours from '../components/LocationHours';
import LocationMap from '../components/LocationMap';
import ServicesAtFacility from '../components/ServicesAtFacility';
import { FacilityType } from '../constants';

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

  render() {
    const { facility, currentQuery } = this.props;
    const isVbaFacility =
      facility?.attributes?.facilityType === FacilityType.VA_BENEFITS_FACILITY;

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
      <>
        {isVbaFacility && (
          <MetaTags>
            <meta
              name="description"
              content="We help Veterans, service members, and their families access VA benefits and services. Benefits we can help with include disability compensation, education benefits, life insurance, pensions, and home loans. Find a benefit office near you or sign up for updates."
            />
          </MetaTags>
        )}
        <div
          className="row facility-detail all-details"
          id="facility-detail-id"
        >
          <div className="usa-width-two-thirds medium-7 columns vads-u-margin-right--2">
            <div>
              <FacilityInfo facility={facility} headerRef={this.headerRef} />
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
                <LocationHours location={facility} />
              </div>
            </div>
          </div>
        </div>
      </>
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

FacilityDetail.propTypes = {
  currentQuery: PropTypes.object,
  facility: PropTypes.object,
  fetchVAFacility: PropTypes.func,
  params: PropTypes.object,
};
