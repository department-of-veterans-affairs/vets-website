import React, { Component } from 'react';

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

    return (
      <div className="mb2">
        <h4 className="highlight">Veteran-reported Satisfaction Scores</h4>
        <div className="mb2">
          <p>Current as of <strong>{healthFeedbackAttrs.effective_date_range}</strong></p>
          <h4>Urgent care appointments</h4>
          <p>% of Veterans who say they usually or always get an appointment when they need care right away</p>
          <div className="mb2">
            <p><strong>Primary care at this location</strong></p>
            <StatsBar percent={healthFeedbackAttrs.primary_care_urgent * 100}/>
            <p><strong>National VA primary care average</strong></p>
            <StatsBar percent={70} color="grey"/>
          </div>
          <div className="mb2">
            <p><strong>Specialty care at this location</strong></p>
            <StatsBar percent={healthFeedbackAttrs.specialty_care_urgent * 100}/>
            <p><strong>National VA specialty care average</strong></p>
            <StatsBar percent={70} color="grey"/>
          </div>

          <h4>Routine care appointments</h4>
          <p>% of Veterans who say they usually or always get an appointment when they need it</p>
          <div className="mb2">
            <p><strong>Primary care at this location</strong></p>
            <StatsBar percent={healthFeedbackAttrs.primary_care_routine * 100}/>
            <p><strong>National VA primary care average</strong></p>
            <StatsBar percent={70} color="grey"/>
          </div>
          <div className="mb2">
            <p><strong>Specialty care at this location</strong></p>
            <StatsBar percent={healthFeedbackAttrs.specialty_care_routine * 100}/>
            <p><strong>National VA specialty care average</strong></p>
            <StatsBar percent={70} color="grey"/>
          </div>
        </div>
      </div>
    );
  }
}
