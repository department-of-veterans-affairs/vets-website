import React from 'react';
import PropTypes from 'prop-types';
import AccessTroubleAlertBox from './AccessTroubleAlertBox';
import NoRecordsMessage from './NoRecordsMessage';

const RecordListSection = ({
  children,
  accessAlert,
  accessAlertType,
  recordCount,
  recordType,
}) => {
  if (accessAlert) {
    return <AccessTroubleAlertBox alertType={accessAlertType} />;
  }
  if (recordCount === 0) {
    return <NoRecordsMessage type={recordType} />;
  }
  if (recordCount) {
    return children;
  }
  return (
    <div className="vads-u-margin-y--8">
      <va-loading-indicator
        message="We’re loading your records. This could take up to a minute."
        setFocus
        data-testid="loading-indicator"
      />
    </div>
  );
};

export default RecordListSection;

RecordListSection.propTypes = {
  accessAlert: PropTypes.bool,
  accessAlertType: PropTypes.string,
  children: PropTypes.object,
  recordCount: PropTypes.number,
  recordType: PropTypes.string,
};
