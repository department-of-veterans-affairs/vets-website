import React, { Component } from 'react';
import pluralize from 'pluralize';
import { startCase } from 'lodash';
import classNames from 'classnames';

export default class AppointmentInfo extends Component {
  constructor() {
    super();

    this.state = {
      newPatientTimesExpanded: false,
      existingPatientTimesExpanded: false,
    };
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
    const specialtyKeys = healthAccessAttrs && Object.keys(healthAccessAttrs);
    delete specialtyKeys.primaryCare;

    if (specialtyKeys && specialtyKeys.length === 0) {
      return null;
    }

    const renderStat = (label, value) => {
      if (value) {
        return (
          <li key={label}>{label}: <strong>{pluralize('day', value.toFixed(0), true)}</strong></li>
        );
      }
      return null;
    };

    const renderSpecialtyTimes = (existing = false) => {
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
                return renderStat(startCase(k.replace(/([A-Z])/g, ' $1')), healthAccessAttrs[k][existing ? 'existing' : 'new']);
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
              return renderStat(startCase(k.replace(/([A-Z])/g, ' $1')), healthAccessAttrs[k][existing ? 'existing' : 'new']);
            })}
            {renderMoreTimes()}
          </ul>
        </li>
      );
    };

    return (
      <div className="mb2">
        <h4 className="highlight">Appointments</h4>
        <div className="mb2">
          <h4>New patient wait times</h4>
          <p>The average number of days a Veteran who hasn't been to this location has to wait for a non-urgent appointment</p>
          <ul>
            {renderStat('Primary Care', healthAccessAttrs.primaryCare.new)}
            {renderSpecialtyTimes()}
          </ul>
        </div>
        {healthAccessAttrs.primaryCare.existing && <div className="mb2">
          <h4>Existing patient wait times</h4>
          <p>The average number of days a patient who has already been to this location has to wait for a non-urgent appointment.</p>
          <ul>
            {renderStat('Primary Care', healthAccessAttrs.primaryCare.existing)}
            {renderSpecialtyTimes(true)}
          </ul>
        </div>}
      </div>
    );
  }
}
