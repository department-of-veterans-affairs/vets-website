import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVAFacilities } from '../actions';
import FacilityDetailsList from './FacilityDetailsList';

class VAFacility extends Component {
  componentWillMount() {
    this.props.fetchVAFacilities(this.props.params.id);
  }

  renderFacility(facility) {
    if(!facility)
      return;

    return (
      <div key={facility.name}>
        <h1>{facility.name}</h1>
        <FacilityDetailsList key={facility.id} facility={facility} />
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.renderFacility(this.props.facility) }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchVAFacilities }, dispatch);
}

function mapStateToProps(state) {
  return { facility: state.facilities.facilityDetail }
}

export default connect(mapStateToProps, mapDispatchToProps)(VAFacility);
