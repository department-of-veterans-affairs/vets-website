import React, { Component } from 'react';

export default class FacilityHours extends Component {
  render() {
    const { info } = this.props;
    if (!info) {
      return null;
    }

    return (
      <div>
        <h5>Hours of Operation:</h5>
        <div className="row">
          <div className="medium-6 columns details-map">
              Monday:
          </div>
          <div className="medium-6 columns column1">
              {info.monday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns details-map">
              Tuesday:
          </div>
          <div className="medium-6 columns column1">
              {info.tuesday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns details-map">
              Wednesday:
          </div>
          <div className="medium-6 columns column1">
              {info.wednesday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns details-map">
              Thursday:
          </div>
          <div className="medium-6 columns column1">
              {info.thursday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns details-map">
              Friday:
          </div>
          <div className="medium-6 columns column1">
              {info.friday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns details-map">
              Saturday:
          </div>
          <div className="medium-6 columns column1">
              {info.saturday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns details-map">
              Sunday:
          </div>
          <div className="medium-6 columns column1">
              {info.sunday}
          </div>
        </div>
      </div>
    );
  }
}
