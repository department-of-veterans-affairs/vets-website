import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { scrollToFirstError } from 'platform/utilities/ui';

import IntroductionPage from '../components/submit-flow/pages/IntroductionPage';
import MileagePage from '../components/submit-flow/pages/MileagePage';
import VehiclePage from '../components/submit-flow/pages/VehiclePage';
import AddressPage from '../components/submit-flow/pages/AddressPage';
import ReviewPage from '../components/submit-flow/pages/ReviewPage';
import ConfirmationPage from '../components/submit-flow/pages/ConfirmationPage';
import UnsupportedClaimTypePage from '../components/submit-flow/pages/UnsupportedClaimTypePage';
import SubmissionErrorPage from '../components/submit-flow/pages/SubmissionErrorPage';

import Breadcrumbs from '../components/Breadcrumbs';
import { selectAppointment } from '../redux/selectors';
import { HelpTextManage } from '../components/HelpText';
import { getAppointmentData, submitMileageOnlyClaim } from '../redux/actions';

const SubmitFlowWrapper = () => {
  const dispatch = useDispatch();
  const { apptId } = useParams();

  const { data: appointmentData, error, isLoading } = useSelector(
    selectAppointment,
  );
  const { error: submissionError } = useSelector(
    state => state.travelPay.claimSubmission,
  );

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const canSubmitMileage = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  useEffect(
    () => {
      if (apptId && !appointmentData && !error) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, appointmentData, apptId, error],
  );

  const [yesNo, setYesNo] = useState({
    mileage: '',
    vehicle: '',
    address: '',
  });

  const [pageIndex, setPageIndex] = useState(0);
  const [isUnsupportedClaimType, setIsUnsupportedClaimType] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const onSubmit = () => {
    if (!isAgreementChecked) {
      scrollToFirstError();
      return;
    }
    dispatch(submitMileageOnlyClaim(appointmentData.localStartTime));
    setPageIndex(pageIndex + 1);
  };

  const pageList = [
    {
      page: 'intro',
      component: (
        <IntroductionPage
          onStart={e => {
            e.preventDefault();
            setPageIndex(pageIndex + 1);
          }}
        />
      ),
    },
    {
      page: 'mileage',
      component: (
        <MileagePage
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          setYesNo={setYesNo}
          yesNo={yesNo}
          setIsUnsupportedClaimType={setIsUnsupportedClaimType}
        />
      ),
    },
    {
      page: 'vehicle',
      component: (
        <VehiclePage
          setYesNo={setYesNo}
          yesNo={yesNo}
          setIsUnsupportedClaimType={setIsUnsupportedClaimType}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      ),
    },
    {
      page: 'address',
      component: (
        <AddressPage
          yesNo={yesNo}
          setYesNo={setYesNo}
          setIsUnsupportedClaimType={setIsUnsupportedClaimType}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      ),
    },
    {
      page: 'review',
      component: (
        <ReviewPage
          onSubmit={onSubmit}
          setYesNo={setYesNo}
          setPageIndex={setPageIndex}
          isAgreementChecked={isAgreementChecked}
          setIsAgreementChecked={setIsAgreementChecked}
        />
      ),
    },
    {
      page: 'confirm',
      component: <ConfirmationPage />,
    },
  ];

  if (toggleIsLoading || isLoading) {
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
      <article className="usa-grid-full vads-u-margin-bottom--0">
        <Breadcrumbs />
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {isUnsupportedClaimType && (
            <UnsupportedClaimTypePage
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              setIsUnsupportedClaimType={setIsUnsupportedClaimType}
            />
          )}
          {submissionError && <SubmissionErrorPage />}
          {!isUnsupportedClaimType &&
            !submissionError &&
            pageList[pageIndex].component}
          <div className="vads-u-margin-top--4">
            <va-need-help>
              <div slot="content">
                <HelpTextManage />
              </div>
            </va-need-help>
          </div>
        </div>
      </article>
    </Element>
  );
};

export default SubmitFlowWrapper;
