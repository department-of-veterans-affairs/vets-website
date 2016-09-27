import { compact } from 'lodash';
import React, { Component } from 'react';

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
      attributes: { address, phone, hours }
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
          <br/>
          <h5>Hours of Operation:</h5>
          <div className="row">
            <div className="medium-6 columns details-map">
                Monday:
            </div>
            <div className="medium-6 columns column1">
                {hours.monday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Tuesday:
            </div>
            <div className="medium-6 columns column1">
                {hours.tuesday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Wednesday:
            </div>
            <div className="medium-6 columns column1">
                {hours.wednesday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Thursday:
            </div>
            <div className="medium-6 columns column1">
                {hours.thursday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Friday:
            </div>
            <div className="medium-6 columns column1">
                {hours.friday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Saturday:
            </div>
            <div className="medium-6 columns column1">
                {hours.saturday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Sunday:
            </div>
            <div className="medium-6 columns column1">
                {hours.sunday}
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
        <h5>Street Address:</h5>
        <p className="facility-details">
        {address.building}<br/>
        {addressString[0]}<br/>
        {addressString[1]}<br/>
        </p>
        {facilityOperations}
      </div>
    );
  }
}

export default FacilityInfo;
