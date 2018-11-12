import React, { Component } from 'react';
import { get, some, pull, startCase } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';

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

  hasPrimaryCare(accessAttrs, category) {
    const value = get(accessAttrs, ['primaryCare', category]);
    return value || value === 0;
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
            {label}:{' '}
            <strong>
              {value.toFixed(0)} {dayString}
            </strong>
          </li>
        );
      }
      return null;
    };

    const renderSpecialtyTimes = (existing = false) => {
      const specialtyKeys = healthAccessAttrs && Object.keys(healthAccessAttrs);
      pull(specialtyKeys, 'primaryCare', 'effectiveDate');
      specialtyKeys.sort();

      if (specialtyKeys && specialtyKeys.length === 0) {
        return null;
      }

      const firstThree = specialtyKeys.slice(0, 3);
      const lastToEnd = specialtyKeys.slice(3);
      let showHideKey;

      if (existing) {
        showHideKey = 'newPatientTimesExpanded';
      } else {
        showHideKey = 'existingPatientTimesExpanded';
      }

      const onClick = () => {
        recordEvent({ event: 'fl-show-waittimes' });
        this.setState({
          [showHideKey]: !this.state[showHideKey],
        });
      };

      const seeMoreClasses = classNames({
        'va-button-link': true,
        seeMore: true,
        expanded: this.state[showHideKey],
      });

      const renderMoreTimes = () =>
        this.state[showHideKey] &&
        lastToEnd.map(k =>
          renderStat(
            startCase(k.replace(/([A-Z])/g, ' $1')),
            healthAccessAttrs[k][existing ? 'established' : 'new'],
            true,
          ),
        );

      return [
        <li key="specialty-care">Specialty care:</li>,
        firstThree.map(k =>
          renderStat(
            startCase(k.replace(/([A-Z])/g, ' $1')),
            healthAccessAttrs[k][existing ? 'established' : 'new'],
            true,
          ),
        ),
        lastToEnd.length > 0 && renderMoreTimes(),
        <li key="show-more" className="show-more">
          <button
            onClick={onClick}
            className={seeMoreClasses}
            aria-expanded={this.state[showHideKey] ? 'true' : 'false'}
          >
            See {this.state[showHideKey] ? 'less' : 'more'}
          </button>
        </li>,
      ];
    };

    return (
      <div className="mb2">
        <h4 className="highlight">Appointments</h4>
        <p>
          Current as of{' '}
          <strong>
            {moment(healthAccessAttrs.effectiveDate, 'YYYY-MM-DD').format(
              'MMMM YYYY',
            )}
          </strong>
        </p>
        {this.anyWaitTimes(healthAccessAttrs, 'new') && (
          <div className="mb2">
            <h4>New patient wait times</h4>
            <p>
              The average number of days a Veteran who hasn’t been to this
              location has to wait for a non-urgent appointment
            </p>
            <ul>
              {this.hasPrimaryCare(healthAccessAttrs, 'new') &&
                renderStat('Primary Care', healthAccessAttrs.primaryCare.new)}
              {renderSpecialtyTimes()}
            </ul>
          </div>
        )}
        {this.anyWaitTimes(healthAccessAttrs, 'established') && (
          <div className="mb2">
            <h4>Existing patient wait times</h4>
            <p>
              The average number of days a patient who has already been to this
              location has to wait for a non-urgent appointment.
            </p>
            <ul>
              {this.hasPrimaryCare(healthAccessAttrs, 'established') &&
                renderStat(
                  'Primary Care',
                  healthAccessAttrs.primaryCare.established,
                )}
              {renderSpecialtyTimes(true)}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
