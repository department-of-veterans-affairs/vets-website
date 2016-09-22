import React, { Component } from 'react';
import { compact } from 'lodash';

class FacilityInfo extends Component {
  render() {
    const { info } = this.props;

    let facilityPhoneNumbers;
    if (!this.props.info) {
      return (
        <div></div>
      );
    }

    if (info.facilityType === 'facility') {
      facilityPhoneNumbers = (
        <div className="mb2">
          <h5>Phone:</h5>
          <div className="row">
            <div className="medium-6 columns details-map">
                Main Number:
            </div>
            <div className="medium-6 columns column1">
                {info.phone.main}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Fax:
            </div>
            <div className="medium-6 columns column1">
                {info.phone.fax}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                After Hours:
            </div>
            <div className="medium-6 columns column1">
                {info.phone.afterHours}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Pharmacy:
            </div>
            <div className="medium-6 columns column1">
                {info.phone.pharmacy}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Enrollment Coordinator:
            </div>
            <div className="medium-6 columns column1">
                {info.phone.enrollmentCoordinator}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Patient Advocate:
            </div>
            <div className="medium-6 columns column1">
                {info.phone.patientAdvocate}
            </div>
          </div>
        </div>
      );
    } else {
      facilityPhoneNumbers = (
        <div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Cemetary Type:
            </div>
            <div className="medium-6 columns column1">
                {info.cemetary.cemetaryType}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Cemetery Operations:
            </div>
            <div className="medium-6 columns column1">
                {info.cemetary.operations}
            </div>
          </div>
        </div>
      );
    }

    const addressString = compact([
      info.address.street1,
      info.address.street2,
      info.address.city,
      info.address.state,
      info.address.zip,
    ]).join(', ');

    return (
      <div>
        <p className="facility-details">
          {addressString}
        </p>
        <p className="facility-details">
          Distance: 0.5 miles
        </p>
        <div className="small-6 medium-6 columns">
          <a href="#" className="facility-conact-link">
            <i className="fa fa-phone" aria-hidden="true"></i>{info.phone.main}
          </a>
        </div>
        <div className="small-6 medium-6 columns">
          <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressString}`} target="_blank" className="facility-conact-link">
            <i className="fa fa-road" aria-hidden="true"></i>Directions
          </a>
        </div>
        <hr className="show-for-small-only"/>
        <div className="show-for-medium-up">
          {facilityPhoneNumbers}
        </div>
      </div>
    );
  }
}

export default FacilityInfo;
