import React, { Component } from 'react';
import { isEmpty, compact } from 'lodash';

import StatsBar from './StatsBar';

export default class AccessToCare extends Component {
  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    if (facility.attributes.facility_type !== 'va_health_facility') {
      return null;
    }

    const healthFeedbackAttrs = facility.attributes.feedback.health;

    if (isEmpty(compact(
      [
        healthFeedbackAttrs.primary_care_urgent,
        healthFeedbackAttrs.specialty_care_urgent,
        healthFeedbackAttrs.primary_care_routine,
        healthFeedbackAttrs.specialty_care_routine,
      ]
    ))) { return null; }

    const renderStat = (label, value) => {
      if (!value) return null;

      return (
        <div>
          <p><strong>{label}</strong></p>
          <StatsBar percent={value * 100}/>
        </div>
      );
    };

    return (
      <div className="mb2">
        <h4 className="highlight">Veteran-reported Satisfaction Scores</h4>
        <div className="mb2">
          <p>Current as of <strong>{healthFeedbackAttrs.effective_date_range}</strong></p>
          <h4>Urgent care appointments</h4>
          <p>% of Veterans who say they usually or always get an appointment when they need care right away</p>
          <div className="mb2">
            {renderStat('Primary care at this location', healthFeedbackAttrs.primary_care_urgent)}
          </div>
          <div className="mb2">
            {renderStat('Specialty care at this location', healthFeedbackAttrs.specialty_care_urgent)}
          </div>

          <h4>Routine care appointments</h4>
          <p>% of Veterans who say they usually or always get an appointment when they need it</p>
          <div className="mb2">
            {renderStat('Primary care at this location', healthFeedbackAttrs.primary_care_routine)}
          </div>
          <div className="mb2">
            {renderStat('Specialty care at this location', healthFeedbackAttrs.specialty_care_routine)}
          </div>
        </div>
      </div>
    );
  }
}
