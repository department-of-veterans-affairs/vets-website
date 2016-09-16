import React, { Component } from 'react';
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
      <div className="row">
        <div className="medium-8 columns">
          <div className="details-map">
            <h3>{this.props.facility ? this.props.facility.name : ''}</h3>
            <FacilityInfo info={this.props.facility}/>
            <div>
              <h4>Services at this Facility</h4>
              <ServicesAtFacility info={this.props.facility}/>
            </div>
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
  return { facility: state.facilities.facilityDetail };
}

export default connect(mapStateToProps, mapDispatchToProps)(FacilityDetail);
