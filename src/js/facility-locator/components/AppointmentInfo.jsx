import React, { Component } from 'react';
import { some, pull, startCase } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

export default class AppointmentInfo extends Component {
  constructor() {
    super();

    this.state = {
      newPatientTimesExpanded: false,
      existingPatientTimesExpanded: false,
    };
  }

  anyWaitTimes(accessAttrs, category) {
    return some(Object.keys(accessAttrs),
        (key) => {
          return (typeof accessAttrs[key][category] !== 'undefined' &&
             accessAttrs[key][category] !== null);
        }
        );
  }

  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    if (facility.attributes.facilityType !== 'va_health_facility') {
      return null;
    }

    const healthAccessAttrs = facility.attributes.access.health;

    if (!this.anyWaitTimes(healthAccessAttrs, 'new') && !this.anyWaitTimes(healthAccessAttrs, 'established')) {
      return null;
    }

    const renderStat = (label, value) => {
      if (value !== null) {
        const dayString = value === 1 ? 'day' : 'days';
        return (
          <li key={label}>{label}: <strong>{value.toFixed(0)} {dayString}</strong></li>
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
        this.setState({
          [showHideKey]: !this.state[showHideKey],
        });
      };

      const seeMoreClasses = classNames({
        seeMore: true,
        expanded: this.state[showHideKey],
      });

      const renderMoreTimes = () => {
        return (
          <div>
            {this.state[showHideKey] && <div>
              {lastToEnd.map(k => {
                return renderStat(startCase(k.replace(/([A-Z])/g, ' $1')), healthAccessAttrs[k][existing ? 'established' : 'new']);
              })}
            </div>}
            <a onClick={onClick} className={seeMoreClasses}>See {this.state[showHideKey] ? 'less' : 'more'}</a>
          </div>
        );
      };

      return (
        <li>
          Specialty care:
          <ul>
            {firstThree.map(k => {
              return renderStat(startCase(k.replace(/([A-Z])/g, ' $1')), healthAccessAttrs[k][existing ? 'established' : 'new']);
            })}
            {(lastToEnd.length > 0) && renderMoreTimes()}
          </ul>
        </li>
      );
    };

    return (
      <div className="mb2">
        <h4 className="highlight">Appointments</h4>
        <p>Current as of <strong>{moment(healthAccessAttrs.effectiveDate, 'YYYY-MM-DD').format('MMMM YYYY')}</strong></p>
        {this.anyWaitTimes(healthAccessAttrs, 'new') && <div className="mb2">
          <h4>New patient wait times</h4>
          <p>The average number of days a Veteran who hasn't been to this location has to wait for a non-urgent appointment</p>
          <ul>
            {renderStat('Primary Care', healthAccessAttrs.primaryCare.new)}
            {renderSpecialtyTimes()}
          </ul>
        </div>}
        {this.anyWaitTimes(healthAccessAttrs, 'established') && <div className="mb2">
          <h4>Existing patient wait times</h4>
          <p>The average number of days a patient who has already been to this location has to wait for a non-urgent appointment.</p>
          <ul>
            {renderStat('Primary Care', healthAccessAttrs.primaryCare.established)}
            {renderSpecialtyTimes(true)}
          </ul>
        </div>}
      </div>
    );
  }
}
