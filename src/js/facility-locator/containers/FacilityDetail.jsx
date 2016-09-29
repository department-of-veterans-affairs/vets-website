import { bindActionCreators } from 'redux';
import { compact } from 'lodash';
import { connect } from 'react-redux';
import { fetchVAFacility } from '../actions';
import { Link, browserHistory } from 'react-router';
import FacilityHours from '../components/FacilityHours';
import FacilityMap from '../components/FacilityMap';
import React, { Component } from 'react';
import ServicesAtFacility from '../components/ServicesAtFacility';

class FacilityDetail extends Component {
  componentWillMount() {
    this.props.fetchVAFacility(this.props.params.id);
  }

  renderFacilityInfo() {
    const { facility } = this.props;
    const { address, phone, name } = facility.attributes;
    const addressString = [
      compact([address.building, address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
    ];

    return (
      <div>
        <h3>{name}</h3>
        <div>
          {addressString[0]} {addressString[1]}
        </div>
        <p>
          <a href={`tel:${phone.main}`}>
            <i className="fa fa-phone"/> {phone.main}
          </a>
        </p>
        <p>
          <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressString.join(' ')}`} target="_blank">
            <i className="fa fa-map"/> Directions
          </a>
        </p>
      </div>
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
          <Link to="/facilities" className="facility-back-link" onClick={browserHistory.goBack}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>Back to list
          </Link>
          <div className="details-map">
            {this.renderFacilityInfo()}
            <ServicesAtFacility facility={facility}/>
          </div>
        </div>
        <div className="medium-4 columns">
          <div>
            <FacilityMap info={facility}/>
            <FacilityHours info={facility}/>
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
