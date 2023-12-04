import React from 'react';
import PropTypes from 'prop-types';

const ExclusionPeriodsWidget = ({ exclusionPeriods }) => {
  // Helper function to render information based on each exclusion period
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
            'Dept. of Defense data shows you as having an Education Loan Payment period.';
          break;
        case 'Academy':
          message =
            'Dept. of Defense data shows you graduated and received a commission from a military academy.';
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
  // If there are no exclusion periods data, display a default message or handle as needed
  if (!exclusionPeriods || exclusionPeriods.length === 0) {
    return (
      <va-alert status="info">No exclusion periods data available.</va-alert>
    );
  }
  // Render the exclusion information
  return <div>{renderExclusionInfo()}</div>;
};
ExclusionPeriodsWidget.propTypes = {
  exclusionPeriods: PropTypes.arrayOf(PropTypes.string),
};
export default ExclusionPeriodsWidget;
