import React, { useEffect } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import InProgressMedicationsProcessList from '../components/PrescriptionsInProgress/InProgressMedicationsProcessList';
import NeedHelp from '../components/shared/NeedHelp';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import useFetchPrescriptionsInProgress from '../hooks/PrescriptionsInProgress/useFetchPrescriptionsInProgress';
import { pageType, dataDogActionNames } from '../util/dataDogConstants';

const PrescriptionsInProgress = () => {
  const {
    inProgress,
    shipped,
    submitted,
    tooEarly,
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

    // TODO: Implement empty state design for when there are no in-progress medications
    return (
      <InProgressMedicationsProcessList
        inProgress={inProgress}
        shipped={shipped}
        submitted={submitted}
        tooEarly={tooEarly}
      />
    );
  };

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  return (
    <div>
      <h1 data-testid="in-progress-medications-heading">
        In-progress medications
      </h1>
      <p>
        Medications that are shipped will remain in this list for 15 days from
        the date of shipping. To review all your medications, go to your
        medication history.
      </p>
      <Link
        data-testid="history-link"
        to="/history"
        data-dd-action-name={
          dataDogActionNames.inProgressPage
            .GO_TO_REVIEW_AND_PRINT_MEDICATION_HISTORY_LINK
        }
      >
        Review and print list of medications
      </Link>
      <span className="vads-u-margin-x--1">|</span>
      <Link
        data-testid="refill-link"
        to="/"
        data-dd-action-name={
          dataDogActionNames.inProgressPage.REFILL_MEDICATIONS_LINK
        }
      >
        Refill medications
      </Link>
      {renderContent()}
      <NeedHelp page={pageType.IN_PROGRESS} headingLevel={2} />
    </div>
  );
};

export default PrescriptionsInProgress;
