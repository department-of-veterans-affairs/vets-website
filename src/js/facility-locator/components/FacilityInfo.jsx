import React, { Component } from 'react';
import { compact } from 'lodash';

class FacilityInfo extends Component {
  render() {
    let facilityOperations;

    if (!this.props.info) {
      return (
        <div></div>
      );
    }

    const {
      type,
      attributes: { address, phone }
    } = this.props.info;

    const addressString = [
      compact([address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
    ];

    if (type === 'va_health_facility') {
      facilityOperations = (
        <div>
          <h5>Phone:</h5>
          <div className="row">
            <div className="medium-6 columns details-map">
                Main Number:
            </div>
            <div className="medium-6 columns column1">
                {phone.main}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Fax:
            </div>
            <div className="medium-6 columns column1">
                {phone.fax}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                After Hours:
            </div>
            <div className="medium-6 columns column1">
                {phone.afterHours}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Pharmacy:
            </div>
            <div className="medium-6 columns column1">
                {phone.pharmacy}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Enrollment Coordinator:
            </div>
            <div className="medium-6 columns column1">
                {phone.enrollmentCoordinator}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Patient Advocate:
            </div>
            <div className="medium-6 columns column1">
                {phone.patientAdvocate}
            </div>
          </div>
        </div>
      );
    } else {
      facilityOperations = (
        <div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Cemetary Type:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.cemetary.cemetaryType}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Cemetery Operations:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.cemetary.operations}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p>
          Distance: 0.5 miles
        </p>
        <h5>Street Address:</h5>
        <p className="facility-details">
        {address.building}<br/>
        {addressString[0]}<br/>
        {addressString[1]}<br/>
        </p>
        <div className="small-6 medium-6 columns">
          <a href="#" className="facility-conact-link">
            <i className="fa fa-phone" aria-hidden="true"></i>{phone.main}
          </a>
        </div>
        <div className="small-6 medium-6 columns">
          <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressString}`} target="_blank" className="facility-conact-link">
            <i className="fa fa-road" aria-hidden="true"></i>Directions
          </a>
        </div>
        <hr className="show-for-small-only light"/>
        {facilityOperations}
      </div>
    );
  }
}

export default FacilityInfo;
