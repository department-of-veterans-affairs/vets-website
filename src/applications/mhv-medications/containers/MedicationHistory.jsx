import React, { useEffect } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import NeedHelp from '../components/shared/NeedHelp';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import useFetchPrescriptionsInProgress from '../hooks/PrescriptionsInProgress/useFetchPrescriptionsInProgress';
// import { useFetchPrescriptionsList } from '../hooks/MedicationsList/useFetchPrescriptionsList';
import { pageType } from '../util/dataDogConstants';

const MedicationHistory = () => {
  const {
    // prescriptions,
    prescriptionsApiError,
    isLoading,
  } = useFetchPrescriptionsInProgress();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="vads-u-padding-y--9">
          <va-loading-indicator
            message="Loading medications..."
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      );
    }

    if (prescriptionsApiError) {
      return <ApiErrorNotification errorType="access" content="medications" />;
    }
    // TODO: List of medications and sort
    return <></>;
  };

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  return (
    <div>
      <h1 data-testid="medication-history-heading">Medication history</h1>
      {/* TODO verify link destination */}
      <Link to="/in-progress">Go to your in-prgroess medications</Link>
      <span className="vads-u-margin-x--1">|</span>
      <Link to="/refill">Refill medications</Link>
      {renderContent()}
      <NeedHelp page={pageType.IN_PROGRESS} headingLevel={2} />
    </div>
  );
};

export default MedicationHistory;
