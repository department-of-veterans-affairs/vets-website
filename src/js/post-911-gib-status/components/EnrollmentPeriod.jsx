import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../utils/helpers';

class EnrollmentPeriod extends React.Component {
  render() {
    const { enrollment } = this.props;

    const fullTimeHours = enrollment.fullTimeHours ? (
      <div className="usa-grid-full">
        <div className="usa-width-one-third">
          <span><strong>On-campus Hours: </strong></span>
        </div>
        <div className="usa-width-one-third">
          {enrollment.fullTimeHours}
        </div>
      </div>
    ) : null;

    const distanceHours = enrollment.distanceHours ? (
      <div className="usa-grid-full">
        <div className="usa-width-one-third">
          <span><strong>Distance Hours: </strong></span>
        </div>
        <div className="usa-width-one-third">
          {enrollment.distanceHours}
        </div>
      </div>
    ) : null;

    const typeOfChange = enrollment.amendmentList && enrollment.amendmentList[0].type ? (
      <div className="usa-grid-full">
        <div className="usa-width-one-third">
          <span><strong>Type of Change: </strong></span>
        </div>
        <div className="usa-width-one-third">
          {enrollment.amendmentList[0].type}
        </div>
      </div>
    ) : null;

    const changeEffectiveDate = enrollment.amendmentList && enrollment.amendmentList[0].changeEffectiveDate ? (
      <div className="usa-grid-full">
        <div className="usa-width-one-third">
          <span><strong>Change Effective Date: </strong></span>
        </div>
        <div className="usa-width-one-third">
          {formatDate(enrollment.amendmentList[0].changeEffectiveDate)}
        </div>
      </div>
    ) : null;

    return (
      <div>
        <hr/>
        <h4>{formatDate(enrollment.beginDate)} to {formatDate(enrollment.endDate)} at {enrollment.facilityName} ({enrollment.facilityCode})</h4>
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
