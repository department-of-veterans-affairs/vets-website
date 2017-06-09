import React from 'react';
import PropTypes from 'prop-types';

import { formatDateShort } from '../utils/helpers';

class EnrollmentPeriod extends React.Component {
  constructor() {
    super();
    this.renderLineOfData = this.renderLineOfData.bind(this);
  }

  renderLineOfData(label, value) {
    return (
      <div className="usa-grid-full">
        <div className="usa-width-one-third">
          <span><strong>{label}: </strong></span>
        </div>
        <div className="usa-width-one-third">
          {value}
        </div>
      </div>
    );
  }

  render() {
    const { enrollment } = this.props;

    const fullTimeHours = enrollment.fullTimeHours ?
        this.renderLineOfData('On-campus Hours', enrollment.fullTimeHours)
        : null;

    const distanceHours = enrollment.distanceHours ?
        this.renderLineOfData('Distance Hours', enrollment.distanceHours)
        : null;

    const typeOfChange = enrollment.amendmentList && enrollment.amendmentList[0].type ?
        this.renderLineOfData('Type of Change', enrollment.amendmentList[0].type)
        : null;

    const changeEffectiveDate = enrollment.amendmentList && enrollment.amendmentList[0].changeEffectiveDate ?
        this.renderLineOfData('Change Effective Date', enrollment.amendmentList[0].changeEffectiveDate)
        : null;

    return (
      <div>
        <hr/>
        <h4>{formatDateShort(enrollment.beginDate)} to {formatDateShort(enrollment.endDate)} at {enrollment.facilityName} ({enrollment.facilityCode})</h4>
        {fullTimeHours}
        {distanceHours}
        {typeOfChange}
        {changeEffectiveDate}
      </div>
    );
  }
}

EnrollmentPeriod.propTypes = {
  enrollment: PropTypes.object
};

export default EnrollmentPeriod;
