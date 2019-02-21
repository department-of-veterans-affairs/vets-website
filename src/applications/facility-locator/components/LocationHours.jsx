import { values, every, capitalize } from 'lodash';
import React, { Component } from 'react';
import Raven from 'raven-js';
import moment from 'moment';

/**
 * VA Facility Known Operational Hours
 */
export default class LocationHours extends Component {
  convertHour(hour, day) {
    const hours = hour.split('-');
    const isValid = hours.every(time => moment(time, 'hmmA').isValid());

    if (!isValid) {
      Raven.captureMessage('API data malformed', {
        extra: {
          data: this.props.location,
          errorData: {
            hours: { [day]: hour },
          },
        },
      });

      return '';
    }

    return hours.map(time => moment(time, 'hmmA').format('h:mmA')).join(' - ');
  }

  convertHours(hours) {
    return Object.keys(hours).reduce((accum, key) => {
      if (hours[key] === '-') {
        return { ...accum, [key]: 'Closed' };
      }

      if (!this.convertHour(hours[key], key)) {
        return { ...accum };
      }

      return { ...accum, [key]: this.convertHour(hours[key]) };
    }, {});
  }

  isValidObject(location) {
    if (!location) {
      return false;
    }

    const isVetCenter = location.attributes.facilityType === 'vet_center';

    if (
      every(values(location.attributes.hours), hour => !hour) &&
      !isVetCenter
    ) {
      return false;
    }

    return true;
  }

  renderVetCenterContent() {
    const { location } = this.props;
    if (location && location.attributes.facilityType === 'vet_center') {
      return (
        <p>
          In addition to the hours listed above, all Vet Centers maintain
          non-traditional hours that are specific to each site and can change
          periodically given local Veteran, Service member & Family needs.
          Please contact your Vet Center to obtain the current schedule.
        </p>
      );
    }
    return null;
  }

  render() {
    const { location } = this.props;

    if (!this.isValidObject(location)) {
      return null;
    }

    const {
      attributes: { hours },
    } = location;

    const mappedHours = this.convertHours(hours);

    return (
      <div>
        <h4 className="highlight">Hours of Operation</h4>
        <div>
          {Object.keys(mappedHours).map(h => {
            if (h !== 'notes' && mappedHours[h] && mappedHours[h] !== '') {
              return (
                <div className="row" key={h}>
                  <div className="small-6 columns">{capitalize(h)}:</div>
                  <div className="small-6 columns">
                    {capitalize(mappedHours[h])}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        {this.renderVetCenterContent()}
      </div>
    );
  }
}
