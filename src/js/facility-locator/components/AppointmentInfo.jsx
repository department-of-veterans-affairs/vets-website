import React, { Component } from 'react';
import pluralize from 'pluralize';
import { isEmpty, compact } from 'lodash';

export default class AppointmentInfo extends Component {
  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    if (facility.attributes.facility_type !== 'va_health_facility') {
      return null;
    }

    const healthAccessAttrs = facility.attributes.access.health;

    if (isEmpty(compact([
      healthAccessAttrs.primary_care_wait_days,
      healthAccessAttrs.specialty_care_wait_days,
      healthAccessAttrs.mental_health_wait_days,
    ]))) { return null; }

    const renderStat = (label, value) => {
      if (value) {
        return (
          <li>{label}: <strong>{pluralize('day', value.toFixed(0), true)}</strong></li>
        );
      }
      return null;
    };

    return (
      <div className="mb2">
        <h4 className="highlight">Appointments</h4>
        <div className="mb2">
          <h4>New patient wait times</h4>
          <p>The average number of days a Veteran who hasn't been to this location has to wait for a non-urgent appointment</p>
          <ul>
            {renderStat('Primary care', healthAccessAttrs.primary_care_wait_days)}
            {renderStat('Specialty care', healthAccessAttrs.specialty_care_wait_days)}
            {renderStat('Mental health care', healthAccessAttrs.mental_health_wait_days)}
          </ul>
        </div>
      </div>
    );
  }
}
