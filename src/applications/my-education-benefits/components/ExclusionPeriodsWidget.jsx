import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchExclusionPeriods } from '../actions/index';
import { getAppData } from '../selectors/selectors';

const ExclusionPeriodsWidget = ({ appData, fetchExclusionPeriodsData }) => {
  const {
    exclusionPeriods,
    isLoading,
    error,
    mebExclusionPeriodEnabled,
  } = appData;

  useEffect(() => {
    if (mebExclusionPeriodEnabled) {
      fetchExclusionPeriodsData();
    }
  }, [fetchExclusionPeriodsData, mebExclusionPeriodEnabled]);

  if (isLoading) {
    return <va-alert status="info">Loading Exclusion Periods Data...</va-alert>;
  }

  if (error) {
    return (
      <va-alert status="error">
        Error fetching exclusion periods: {error.message}
      </va-alert>
    );
  }

  const renderExclusionInfo = () => {
    return exclusionPeriods.map((period, index) => {
      let message = '';
      switch (period) {
        case 'ROTC':
          message =
            'Dept. of Defense data shows you were commissioned as the result of a Senior ROTC.';
          break;
        case 'LRP':
          message =
            'You have been identified as having an Education Loan Payment period.';
          break;
        case 'Academy':
          message =
            'Records show you graduated and received a commission from a military academy.';
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

  return (
    <div>
      <h2>Exclusion Periods Information</h2>
      {exclusionPeriods && exclusionPeriods.length > 0 ? (
        renderExclusionInfo()
      ) : (
        <va-alert status="warning">
          No exclusion periods data available.
        </va-alert>
      )}
    </div>
  );
};

ExclusionPeriodsWidget.propTypes = {
  appData: PropTypes.object.isRequired,
  fetchExclusionPeriodsData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  appData: getAppData(state),
});

const mapDispatchToProps = {
  fetchExclusionPeriodsData: fetchExclusionPeriods,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExclusionPeriodsWidget);
