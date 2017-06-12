import React from 'react';
import PropTypes from 'prop-types';

import InfoPair from './InfoPair';

import { formatDateShort } from '../utils/helpers';

class EnrollmentPeriod extends React.Component {
  render() {
    const { enrollment } = this.props;

    const fullTimeHours = <InfoPair label="On-campus Hours" value={enrollment.fullTimeHours}/>;
    const distanceHours = <InfoPair label="Distance Hours" value={enrollment.distanceHours}/>;
    const typeOfChange = enrollment.amendmentList && enrollment.amendmentList.length > 0 &&
      <InfoPair label="Type of Change" value={enrollment.amendmentList[0].type}/>;
    const changeEffectiveDate = enrollment.amendmentList && enrollment.amendmentList.length > 0 &&
      <InfoPair label="Change Effective Date" value={enrollment.amendmentList[0].changeEffectiveDate}/>;

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
