import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import {
  selectVAPMailingAddress,
  selectVAPResidentialAddress,
  isProfileLoading,
  isLoggedIn,
} from 'platform/user/selectors';

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

  const {
    hasFetchedAppointment,
    isLoadingAppointment,
    appointmentData,
    appointmentError,
  } = useSelector(state => state.travelPay);

  const profileLoading = useSelector(state => isProfileLoading(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));

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
      if (userLoggedIn && !hasFetchedAppointment) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, userLoggedIn, hasFetchedAppointment],
  );

  const appIsAvailable =
    !toggleIsLoading && canSubmitMileage && appointmentData;

  // This will actually be handled by the redux action, but for now it lives here
  const [isSubmissionError, setIsSubmissionError] = useState(false);

  const [yesNo, setYesNo] = useState({
    mileage: '',
    vehicle: '',
    address: '',
  });

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
          appointment={appointmentData}
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
          appointment={appointmentData}
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
      component: <ReviewPage handlers={handlers} />,
    },
    {
      page: 'confirm',
      component: <ConfirmationPage />,
    },
  ];

  if (profileLoading || toggleIsLoading || isLoadingAppointment) {
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

  if (appointmentError) {
    return (
      <div>
        <p>
          Oops.... something went wrong and we can’t get your appointment
          details.
        </p>
        <p>{appointmentError.message}</p>
      </div>
    );
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
};

function mapStateToProps(state) {
  return {
    homeAddress: selectVAPResidentialAddress(state),
    mailingAddress: selectVAPMailingAddress(state),
  };
}

export default connect(mapStateToProps)(SubmitFlowWrapper);
