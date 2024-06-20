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
  listCurrentAsOf,
  initialFhirLoad,
}) => {
  if (accessAlert) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertType}
        className="vads-u-margin-bottom--9"
      />
    );
  }
  if (initialFhirLoad && !listCurrentAsOf) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          class="hydrated initial-fhir-load"
          message="We're loading your records for the first time. This can take up to 2 minutes. Stay on this page until your records load."
          setFocus
          data-testid="initial-fhir-loading-indicator"
        />
      </div>
    );
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
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  initialFhirLoad: PropTypes.bool,
  listCurrentAsOf: PropTypes.instanceOf(Date),
  recordCount: PropTypes.number,
  recordType: PropTypes.string,
};
