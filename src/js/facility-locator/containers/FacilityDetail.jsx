import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVAFacility } from '../actions';
import FacilityInfo from '../components/FacilityInfo';
import ServicesAtFacility from '../components/ServicesAtFacility';
import FacilityMap from '../components/FacilityMap';
import FacilityHours from '../components/FacilityHours';

class FacilityDetail extends Component {
  componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id);
  }

  render() {
    return (
      <div className="row facility-detail">
        <div className="medium-8 columns">
          <Link to="/facilities" className="facility-back-link show-for-small-only">
            <i className="fa fa-chevron-left" aria-hidden="true"></i>Back to list
          </Link>
          <div className="details-map">
            <h3>{this.props.facility ? this.props.facility.name : ''}</h3>
            <FacilityInfo info={this.props.facility} currentQuery={this.props.currentQuery}/>
            <ServicesAtFacility info={this.props.facility}/>
          </div>
        </div>
        <div className="medium-4 columns">
          <div>
            <FacilityMap info={this.props.facility}/>
            <FacilityHours info={this.props.facility}/>
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
