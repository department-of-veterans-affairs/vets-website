import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchVAFacility } from '../actions';
import { Link, browserHistory } from 'react-router';
import AccessToCare from '../components/AccessToCare';
import FacilityAddress from '../components/search-results/FacilityAddress';
import FacilityDirectionsLink from '../components/search-results/FacilityDirectionsLink';
import FacilityHours from '../components/FacilityHours';
import FacilityMap from '../components/FacilityMap';
import FacilityPhoneLink from '../components/search-results/FacilityPhoneLink';
import React, { Component } from 'react';
import ServicesAtFacility from '../components/ServicesAtFacility';

class FacilityDetail extends Component {
  componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id);
  }

  renderFacilityWebsite() {
    const { facility } = this.props;
    const { website } = facility.attributes;

    if (!website) {
      return null;
    }

    return (
      <span>
        <a href={website} target="_blank">
          <i className="fa fa-globe"/>Website
        </a>
      </span>
    );
  }

  renderFacilityInfo() {
    const { facility } = this.props;
    const { name } = facility.attributes;

    return (
      <div>
        <h3>{name}</h3>
        <div>
          <FacilityAddress facility={facility}/>
        </div>
        <div>
          <FacilityPhoneLink facility={facility}/>
        </div>
        <div>
          {this.renderFacilityWebsite()}
        </div>
        <div>
          <FacilityDirectionsLink facility={facility}/>
        </div>
        <p>Planning to visit? Please call first as information on this page may change.</p>
      </div>
    );
  }

  renderAccessToCare() {
    const { facility } = this.props;

    if (facility.attributes.facility_type !== 'va_health_facility') {
      return null;
    }

    return (
      <AccessToCare facility={facility}/>
    );
  }

  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    return (
      <div className="row facility-detail">
        <div className="medium-8 columns">
          <Link className="facility-back-link" onClick={browserHistory.goBack}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>Back to list
          </Link>
          <div>
            {this.renderFacilityInfo()}
            <ServicesAtFacility facility={facility}/>
          </div>
        </div>
        <div className="medium-4 columns">
          <div>
            <FacilityMap info={facility}/>
            <div className="mb2">
              <FacilityHours facility={facility}/>
            </div>
            {this.renderAccessToCare()}
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
  return { facility: state.facilities.selectedFacility };
}

export default connect(mapStateToProps, mapDispatchToProps)(FacilityDetail);
