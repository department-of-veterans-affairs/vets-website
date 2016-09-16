import React, { Component } from 'react';

class FacilityInfo extends Component {
  render() {
    let facilityOperations;
    if (!this.props.info) {
      return (
        <div></div>
      );
    }
    if (this.props.info.address.street2) {
      this.street2 = this.props.info.address.street2;
    }
    const street2 = this.props.info.address.street2;
    if (this.props.info.facilityType === 'facility') {
      facilityOperations = (
        <div>
          <h5>Phone:</h5>
          <div className="row">
            <div className="medium-6 columns details-map">
                Main Number:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.phone.main}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Fax:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.phone.fax}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                After Hours:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.phone.afterHours}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Pharmacy:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.phone.pharmacy}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Enrollment Coordinator:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.phone.enrollmentCoordinator}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Patient Advocate:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.phone.patientAdvocate}
            </div>
          </div>
          <br/>
          <h5>Hours of Operation:</h5>
          <div className="row">
            <div className="medium-6 columns details-map">
                Monday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.monday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Tuesday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.tuesday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Wednesday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.wednesday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Thursday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.thursday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Friday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.friday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Saturday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.saturday}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 columns details-map">
                Sunday:
            </div>
            <div className="medium-6 columns column1">
                {this.props.info.sunday}
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
        {this.props.info.address.street1}<br/>
        {street2 ? `${street2}<br/>` : ''}
        {this.props.info.address.city}, {this.props.info.address.state} {this.props.info.address.zip}
        </p>
        {facilityOperations}
      </div>
    );
  }
}

export default FacilityInfo;
