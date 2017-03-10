import { values, every, capitalize } from 'lodash';
import React, { Component } from 'react';

export default class FacilityHours extends Component {
  renderNotes(notes) {
    if (notes) {
      return (
        <div className="row">
          <div className="small-12 columns">
            <p>Notes: {notes}</p>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    const {
      attributes: { hours }
    } = facility;

    if (every(values(hours), h => !h)) {
      return null;
    }

    const hourRows = Object.keys(hours).map(h => {
      if (h !== 'notes' && hours[h] && hours[h] !== '') {
        return (
          <div className="row" key={h}>
            <div className="small-6 columns">
              {capitalize(h)}:
            </div>
            <div className="small-6 columns">
              {capitalize(hours[h])}
            </div>
          </div>
        );
      }
      return null;
    });

    return (
      <div>
        <h4 className="highlight">Hours of Operation</h4>
        <div>
          {hourRows}
        </div>
      </div>
    );
  }
}
