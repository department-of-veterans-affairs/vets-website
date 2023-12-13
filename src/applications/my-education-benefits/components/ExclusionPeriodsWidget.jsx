import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ExclusionPeriodsWidget = ({ formData, displayType = '' }) => {
  const { exclusionPeriods } = formData;

  const getMessageForType = type => {
    switch (type) {
      case 'ROTC':
        return 'Dept. of Defense data shows you were commissioned as the result of a Senior ROTC.';
      case 'LRP':
        return 'Dept. of Defense data shows a period of active duty that the military considers as being used for purposes of repaying an Education Loan.';
      case 'Academy':
        return 'Dept. of Defense data shows you have graduated from a Military Service Academy';
      default:
        return null;
    }
  };
  if (displayType && exclusionPeriods?.includes(displayType)) {
    const message = getMessageForType(displayType);
    return (
      <va-alert key={`exclusion-${displayType}`} status="info">
        {message}
      </va-alert>
    );
  }

  return null;
};
ExclusionPeriodsWidget.propTypes = {
  displayType: PropTypes.string,
  exclusionPeriods: PropTypes.arrayOf(PropTypes.string),
};
ExclusionPeriodsWidget.defaultProps = {
  displayType: '',
};
const mapStateToProps = state => ({
  formData: state?.form?.data,
});
export default connect(mapStateToProps)(ExclusionPeriodsWidget);
