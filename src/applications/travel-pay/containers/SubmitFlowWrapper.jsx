import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import {
  selectVAPMailingAddress,
  selectVAPResidentialAddress,
} from 'platform/user/selectors';
import { scrollToFirstError } from 'platform/utilities/ui';

import IntroductionPage from '../components/submit-flow/pages/IntroductionPage';
import MileagePage from '../components/submit-flow/pages/MileagePage';
import VehiclePage from '../components/submit-flow/pages/VehiclePage';
import AddressPage from '../components/submit-flow/pages/AddressPage';
import ReviewPage from '../components/submit-flow/pages/ReviewPage';
import ConfirmationPage from '../components/submit-flow/pages/ConfirmationPage';
import BreadCrumbs from '../components/Breadcrumbs';

import UnsupportedClaimTypePage from '../components/submit-flow/pages/UnsupportedClaimTypePage';
import SubmissionErrorPage from '../components/submit-flow/pages/SubmissionErrorPage';
import { getAppointmentData } from '../redux/actions';

const SubmitFlowWrapper = ({ homeAddress, mailingAddress }) => {
  const dispatch = useDispatch();
  const { apptId } = useParams();

  const { appointment } = useSelector(state => state.travelPay);

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
      if (apptId && !appointment.data && !appointment.error) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, appointment.data, apptId, appointment.error],
  );

  const appIsAvailable = !toggleIsLoading && canSubmitMileage;

  // This will actually be handled by the redux action, but for now it lives here
  const [isSubmissionError, setIsSubmissionError] = useState(false);

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
    // Placeholder until actual submit is hooked up

    // Uncomment to simulate successful submission
    // setPageIndex(pageIndex + 1);

    // Uncomment to simulate an error
    setIsSubmissionError(true);
  };

  const pageList = [
    {
      page: 'intro',
      component: (
        <IntroductionPage
          appointment={appointment.data}
          error={appointment.error}
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
          appointment={appointment.data}
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
          address={homeAddress || mailingAddress}
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
          appointment={appointment.data}
          address={homeAddress || mailingAddress}
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

  if (toggleIsLoading || appointment.isLoading) {
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
          {/* {appointmentError && (
            <va-alert closeable="false" status="error" role="status" visible>
              <h2 slot="headline">
                We’re sorry, we can’t access your appointment details right now
              </h2>
              <p className="vads-u-margin-top--2">
                Because we need details of your appointment to file your
                mileage-only claim we are not able to continue with your claim
                at this time. Please try again later.
              </p>
            </va-alert>
          )} */}
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
            appIsAvailable &&
            pageList[pageIndex].component}
        </div>
      </article>
    </Element>
  );
};

SubmitFlowWrapper.propTypes = {
  homeAddress: PropTypes.object,
  mailingAddress: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    homeAddress: selectVAPResidentialAddress(state),
    mailingAddress: selectVAPMailingAddress(state),
  };
}

export default connect(mapStateToProps)(SubmitFlowWrapper);
