import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
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

const SubmitFlowWrapper = ({ appointment, homeAddress, mailingAddress }) => {
  const dispatch = useDispatch();
  const { apptId } = useParams();

  const { isLoading, error, data } = appointment;

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
      if (apptId && !data && !error) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, data, apptId, error],
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
          appointment={data}
          error={error}
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
          appointment={data}
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
          appointment={data}
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
  appointment: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    homeAddress: selectVAPResidentialAddress(state),
    mailingAddress: selectVAPMailingAddress(state),
    appointment: state.travelPay.appointment,
  };
}

export default connect(mapStateToProps)(SubmitFlowWrapper);
