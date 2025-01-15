import React, { useState } from 'react';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import IntroductionPage from '../components/submit-flow/pages/IntroductionPage';
import MileagePage from '../components/submit-flow/pages/MileagePage';
import VehiclePage from '../components/submit-flow/pages/VehiclePage';
import AddressPage from '../components/submit-flow/pages/AddressPage';
import ReviewPage from '../components/submit-flow/pages/ReviewPage';
import ConfirmationPage from '../components/submit-flow/pages/ConfirmationPage';
import BreadCrumbs from '../components/Breadcrumbs';

import UnsupportedClaimTypePage from '../components/submit-flow/pages/UnsupportedClaimTypePage';
import SubmissionErrorPage from '../components/submit-flow/pages/SubmissionErrorPage';
import { appointment1 } from '../services/mocks/appointments';

const SubmitFlowWrapper = () => {
  // TODO: Placeholders until backend integration is complete
  // API call based on the URL Params, but for now is hard coded
  const appointment = appointment1;
  // This will actually be handled by the redux action, but for now it lives here
  const [isSubmissionError, setIsSubmissionError] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [isUnsupportedClaimType, setIsUnsupportedClaimType] = useState(false);

  const handlers = {
    onNext: e => {
      e.preventDefault();
      setPageIndex(pageIndex + 1);
    },
    onBack: e => {
      e.preventDefault();
      setPageIndex(pageIndex - 1);
    },
    onSubmit: e => {
      e.preventDefault();
      // Placeholder until actual submit is hooked up

      // Uncomment to simulate successful submission
      // setPageIndex(pageIndex + 1);

      // Uncomment to simulate an error
      setIsSubmissionError(true);
    },
  };

  const pageList = [
    {
      page: 'intro',
      component: (
        <IntroductionPage
          appointment={appointment}
          onStart={e => {
            e.preventDefault();
            setPageIndex(pageIndex + 1);
          }}
        />
      ),
    },
    {
      page: 'mileage',
      component: <MileagePage handlers={handlers} />,
    },
    {
      page: 'vehicle',
      component: <VehiclePage handlers={handlers} />,
    },
    {
      page: 'address',
      component: <AddressPage handlers={handlers} />,
    },
    {
      page: 'review',
      component: <ReviewPage handlers={handlers} />,
    },
    {
      page: 'confirm',
      component: <ConfirmationPage />,
    },
  ];

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const canSubmitMileage = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  if (!canSubmitMileage) {
    window.location.replace('/');
    return null;
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-margin-bottom--3">
        <BreadCrumbs />
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {isUnsupportedClaimType && (
            <UnsupportedClaimTypePage
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              setIsUnsupportedClaimType={setIsUnsupportedClaimType}
            />
          )}
          {isSubmissionError && <SubmissionErrorPage />}
          {!isUnsupportedClaimType &&
            !isSubmissionError &&
            pageList[pageIndex].component}
        </div>
      </article>
    </Element>
  );
};

export default SubmitFlowWrapper;
