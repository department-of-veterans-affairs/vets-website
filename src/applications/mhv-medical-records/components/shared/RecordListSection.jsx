import React from 'react';
import PropTypes from 'prop-types';
import AccessTroubleAlertBox from './AccessTroubleAlertBox';
import TrackedSpinner from './TrackedSpinner';
import useInitialFhirLoadTimeout from '../../hooks/useInitialFhirLoadTimeout';
import { recordTypeKeyNames } from '../../util/constants';

const RecordListSection = ({
  children,
  accessAlert,
  accessAlertType,
  recordCount,
  recordType,
  listCurrentAsOf,
  initialFhirLoad,
}) => {
  const initialFhirLoadTimedOut = useInitialFhirLoadTimeout(initialFhirLoad);

  if (accessAlert || initialFhirLoadTimedOut) {
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
        <TrackedSpinner
          id="initial-fhir-load-spinner"
          class="hydrated initial-fhir-load"
          message="We're loading your records for the first time. This can take up to 2 minutes."
          setFocus
          data-testid="initial-fhir-loading-indicator"
        />
      </div>
    );
  }
  if (recordCount || recordCount === 0) {
    return children;
  }
  return (
    <div className="vads-u-margin-y--8">
      <TrackedSpinner
        id={`${recordTypeKeyNames[recordType]}-list-spinner`}
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
  initialFhirLoad: PropTypes.instanceOf(Date),
  listCurrentAsOf: PropTypes.instanceOf(Date),
  recordCount: PropTypes.number,
  recordType: PropTypes.string,
};
