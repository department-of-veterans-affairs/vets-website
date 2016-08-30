import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVAFacilities } from '../actions';

class VAFacility extends Component {

  componentWillMount() {
    this.props.fetchVAFacilities(this.props.params.id);
  }

  renderFacility(facility) {
    if (facility) {
      return (
        <div key={facility.name}>
          {facility.name}
        </div>
      );
    }
    return (
      <div></div>
    );
  }

  render() {
    return (
      <div>
        <div>A VA Facility</div>
        {this.renderFacility(this.props.facility)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchVAFacilities }, dispatch);
}

function mapStateToProps(state) {
  return { facility: state.facilities.facilityDetail };
}

export default connect(mapStateToProps, mapDispatchToProps)(VAFacility);
