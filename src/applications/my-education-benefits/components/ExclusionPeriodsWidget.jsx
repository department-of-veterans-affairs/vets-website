import React from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ExclusionPeriodsWidget = ({ formData }) => {
  const { exclusionPeriods } = formData;

  const renderExclusionInfo = () => {
    return exclusionPeriods.map((period, index) => {
      let message;
      switch (period) {
        case 'ROTC':
          message =
            'Dept. of Defense data shows you were commissioned as the result of a Senior ROTC.';
          break;
        case 'LRP':
          message =
            'Dept. of Defense data shows a period of active duty that the military considers as being used for purposes of repaying an Education Loan.';
          break;
        case 'Academy':
          message =
            'Dept. of Defense data shows you have graduated from a Military Service Academy';
          break;
        default:
          return null;
      }
      return (
        <va-alert key={`exclusion-${index}`} status="info">
          {message}
        </va-alert>
      );
    });
  };
  if (!exclusionPeriods || exclusionPeriods.length === 0) {
    return (
      <va-alert status="info">No exclusion periods data available.</va-alert>
    );
  }
  return <div>{renderExclusionInfo()}</div>;
};
ExclusionPeriodsWidget.propTypes = {
  exclusionPeriods: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExclusionPeriodsWidget);
