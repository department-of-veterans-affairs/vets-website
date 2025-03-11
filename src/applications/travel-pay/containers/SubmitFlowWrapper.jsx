import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

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
import { getAppointmentData } from '../redux/actions';
import { SmocContext } from '../context/SmocContext';

const SubmitFlowWrapper = () => {
  const { pageIndex, isUnsupportedClaimType } = useContext(SmocContext);
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

  const pageList = [
    IntroductionPage,
    MileagePage,
    VehiclePage,
    AddressPage,
    ReviewPage,
    ConfirmationPage,
  ];
  const SmocPage = pageList[pageIndex];

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
          {isUnsupportedClaimType && <UnsupportedClaimTypePage />}
          {submissionError && <SubmissionErrorPage />}
          {!isUnsupportedClaimType && !submissionError && <SmocPage />}
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
