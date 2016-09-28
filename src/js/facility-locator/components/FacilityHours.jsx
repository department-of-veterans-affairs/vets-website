import React, { Component } from 'react';

export default class FacilityHours extends Component {
  render() {
    if (!this.props.info) {
      return null;
    }

    const {
      attributes: { hours }
    } = this.props.info;

    return (
      <div className="mb2">
        <h4>Hours of Operation:</h4>
        <hr className="title"/>
        <div className="row">
          <div className="medium-6 columns">
              Monday:
          </div>
          <div className="medium-6 columns">
              {hours.monday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Tuesday:
          </div>
          <div className="medium-6 columns">
              {hours.tuesday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Wednesday:
          </div>
          <div className="medium-6 columns">
              {hours.wednesday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Thursday:
          </div>
          <div className="medium-6 columns">
              {hours.thursday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Friday:
          </div>
          <div className="medium-6 columns">
              {hours.friday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Saturday:
          </div>
          <div className="medium-6 columns">
              {hours.saturday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Sunday:
          </div>
          <div className="medium-6 columns">
              {hours.sunday}
          </div>
        </div>
      </div>
    );
  }
}
