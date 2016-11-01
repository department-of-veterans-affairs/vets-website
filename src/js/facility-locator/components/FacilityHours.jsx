import React, { Component } from 'react';

export default class FacilityHours extends Component {
  renderHours(hours) {
    return hours === '-' ? 'Closed' : hours;
  }

  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    const {
      attributes: { hours }
    } = facility;

    return (
      <div>
        <div className="row">
          <div className="small-6 columns">
              Monday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.monday)}
          </div>
        </div>
        <div className="row">
          <div className="small-6 columns">
              Tuesday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.tuesday)}
          </div>
        </div>
        <div className="row">
          <div className="small-6 columns">
              Wednesday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.wednesday)}
          </div>
        </div>
        <div className="row">
          <div className="small-6 columns">
              Thursday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.thursday)}
          </div>
        </div>
        <div className="row">
          <div className="small-6 columns">
              Friday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.friday)}
          </div>
        </div>
        <div className="row">
          <div className="small-6 columns">
              Saturday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.saturday)}
          </div>
        </div>
        <div className="row">
          <div className="small-6 columns">
              Sunday:
          </div>
          <div className="small-6 columns">
            {this.renderHours(hours.sunday)}
          </div>
        </div>
      </div>
    );
  }
}
