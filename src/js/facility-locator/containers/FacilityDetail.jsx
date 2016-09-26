import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVAFacility } from '../actions';
import FacilityInfo from '../components/FacilityInfo';
import ServicesAtFacility from '../components/ServicesAtFacility';
import HowToGetHere from '../components/HowToGetHere';

class FacilityDetail extends Component {
  componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id);
  }

  render() {
    return (
      <div>
        <h2>{this.props.facility ? this.props.facility.name : ''}</h2>

        <div className="medium-4 columns details-map">
          <h4>Facility Details</h4>
          <FacilityInfo info={this.props.facility}/>
        </div>
        <div className="medium-4 columns column1">
          <h4>Services at this Facility</h4>
          <ServicesAtFacility info={this.props.facility}/>
        </div>
        <div className="medium-4 columns clearfix column1">
          <h4>How to Get Here</h4>
          <HowToGetHere info={this.props.facility}/>
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
