import React, { Component } from 'react';

export default class FacilityHours extends Component {
  render() {
    const { info } = this.props;
    if (!info) {
      return null;
    }

    return (
      <div className="mb2">
        <h4>Hours of Operation:</h4>
        <hr className="title"/>
        <div className="row">
          <div className="medium-6 columns">
              Monday:
          </div>
          <div className="medium-6 columns">
              {info.monday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Tuesday:
          </div>
          <div className="medium-6 columns">
              {info.tuesday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Wednesday:
          </div>
          <div className="medium-6 columns">
              {info.wednesday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Thursday:
          </div>
          <div className="medium-6 columns">
              {info.thursday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Friday:
          </div>
          <div className="medium-6 columns">
              {info.friday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Saturday:
          </div>
          <div className="medium-6 columns">
              {info.saturday}
          </div>
        </div>
        <div className="row">
          <div className="medium-6 columns">
              Sunday:
          </div>
          <div className="medium-6 columns">
              {info.sunday}
          </div>
        </div>
      </div>
    );
  }
}
