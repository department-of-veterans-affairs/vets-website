import React, { Component } from 'react';
import { get, some, pull } from 'lodash';
import moment from 'moment';

import { formatServiceName } from '../utils/formatServiceName';

/**
 * VA Facility Appointments
 */
export default class AppointmentInfo extends Component {
  constructor() {
    super();

    this.state = {
      newPatientTimesExpanded: false,
      existingPatientTimesExpanded: false,
    };
  }

  anyWaitTimes(accessAttrs, category) {
    return some(
      Object.keys(accessAttrs),
      key =>
        typeof accessAttrs[key][category] !== 'undefined' &&
        accessAttrs[key][category] !== null,
    );
  }

  render() {
    const { location } = this.props;

    if (!location) {
      return null;
    }

    if (location.attributes.facilityType !== 'va_health_facility') {
      return null;
    }

    const healthAccessAttrs = location.attributes.access.health;
    const { effectiveDate } = location.attributes.access; // V1

    if (!healthAccessAttrs) {
      return null;
    }

    if (
      !this.anyWaitTimes(healthAccessAttrs, 'new') &&
      !this.anyWaitTimes(healthAccessAttrs, 'established')
    ) {
      return null;
    }

    const renderStat = (label, value, sublist = false) => {
      if (value !== null) {
        const dayString = value === 1 ? 'day' : 'days';
        return (
          <li key={label} className={sublist ? 'sublist' : null}>
            {formatServiceName(label)}:{' '}
            <strong>
              {value.toFixed(0)} {dayString}
            </strong>
          </li>
        );
      }
      return null;
    };

    const renderPrimaryCare = (accessAttrs, category) => {
      if (Array.isArray(accessAttrs)) {
        // V1
        const value = accessAttrs.find(
          k => k.service === 'PrimaryCare' && k[category],
        );
        if (value) {
          return renderStat('Primary Care', value[category]);
        }
      } else {
        // V0 legacy structure TODO: remove when fully migrated to V1
        const value = get(accessAttrs, ['primaryCare', category]);
        if (value) {
          return renderStat('Primary Care', value);
        }
      }
      return null;
    };

    const renderSpecialtyTimes = (existing = false) => {
      if (Array.isArray(healthAccessAttrs)) {
        // V1
        const healthAccessSpecialty = healthAccessAttrs.filter(
          acc => acc.service !== 'PrimaryCare',
        );
        return (
          <li key="specialty-care">
            Specialty care:
            <ul className="vads-u-margin-top--1">
              {healthAccessSpecialty.map(k =>
                renderStat(
                  k.service,
                  k.established ? k.established : k.new,
                  true,
                ),
              )}
            </ul>
          </li>
        );
      } else {
        // V0 legacy structure TODO: remove when fully migrated to V1
        const specialtyKeys =
          healthAccessAttrs && Object.keys(healthAccessAttrs);
        pull(specialtyKeys, 'primaryCare', 'effectiveDate');
        specialtyKeys.sort();

        if (specialtyKeys && specialtyKeys.length === 0) {
          return null;
        }

        return (
          <li key="specialty-care">
            Specialty care:
            <ul className="vads-u-margin-top--1">
              {specialtyKeys.map(k =>
                renderStat(
                  k,
                  healthAccessAttrs[k][existing ? 'established' : 'new'],
                  true,
                ),
              )}
            </ul>
          </li>
        );
      }
    };

    return (
      <div className="vads-u-margin-bottom--4">
        <h4 className="highlight">Appointments</h4>
        <p>
          Current as of{' '}
          <strong>
            {moment(effectiveDate || healthAccessAttrs.effectiveDate).format(
              'LL',
            )}
          </strong>
        </p>
        {this.anyWaitTimes(healthAccessAttrs, 'new') && (
          <div className="vads-u-margin-bottom--4">
            <h4>New patient wait times</h4>
            <p>
              The average number of days a Veteran who hasn’t been to this
              location has to wait for a non-urgent appointment
            </p>
            <ul>
              {renderPrimaryCare(healthAccessAttrs, 'new')}
              {renderSpecialtyTimes()}
            </ul>
          </div>
        )}
        {this.anyWaitTimes(healthAccessAttrs, 'established') && (
          <div className="vads-u-margin-bottom--4">
            <h4>Existing patient wait times</h4>
            <p>
              The average number of days a patient who has already been to this
              location has to wait for a non-urgent appointment.
            </p>
            <ul>
              {renderPrimaryCare(healthAccessAttrs, 'established')}
              {renderSpecialtyTimes(true)}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
