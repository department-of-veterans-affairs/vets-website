import React, { useState, useEffect } from 'react';
import {
  selectVAPResidentialAddress,
  isProfileLoading,
  isLoggedIn,
} from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { Element } from 'platform/utilities/scroll';

import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import IntroductionPage from '../components/submit-flow/pages/IntroductionPage';
import MileagePage from '../components/submit-flow/pages/MileagePage';
import VehiclePage from '../components/submit-flow/pages/VehiclePage';
import AddressPage from '../components/submit-flow/pages/AddressPage';
import ReviewPage from '../components/submit-flow/pages/ReviewPage';
import ConfirmationPage from '../components/submit-flow/pages/ConfirmationPage';
import BreadCrumbs from '../components/Breadcrumbs';

import { appointment1 } from '../services/mocks/appointments';
import CantFilePage from '../components/submit-flow/pages/CantFilePage';
import SubmissionErrorPage from '../components/submit-flow/pages/SubmissionErrorPage';

const SubmitFlowWrapper = ({ address }) => {
  // This will need to be an API call based on the apptID passed in the params
  // But for now is hardcoded
  const appointment = appointment1;

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const [yesNo, setYesNo] = useState({
    mileage: '',
    vehicle: '',
    address: '',
  });
  const [cantFile, setCantFile] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  // This will actually be handled by the redux action, but for now it lives here
  const [isSubmissionError, setIsSubmissionError] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);

  const onSubmit = e => {
    e.preventDefault();
    if (!isAgreementChecked) {
      // throw some kind of error
    } else {
      // Placeholder until actual submit is hooked up

      // Uncomment to simulate successful submission
      // setPageIndex(pageIndex + 1);

      // Uncomment to simulate an error
      setIsSubmissionError(true);
    }
  };

  const pageList = [
    {
      page: 'intro',
      component: (
        <IntroductionPage
          appointment={appointment}
          onNext={e => {
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
          appointment={appointment}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          setYesNo={setYesNo}
          yesNo={yesNo}
          setCantFile={setCantFile}
        />
      ),
    },
    {
      page: 'vehicle',
      component: (
        <VehiclePage
          setYesNo={setYesNo}
          yesNo={yesNo}
          setCantFile={setCantFile}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      ),
    },
    {
      page: 'address',
      component: (
        <AddressPage
          address={address}
          yesNo={yesNo}
          setYesNo={setYesNo}
          setCantFile={setCantFile}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      ),
    },
    {
      page: 'review',
      component: (
        <ReviewPage
          appointment={appointment}
          address={address}
          onSubmit={onSubmit}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          isAgreementChecked={isAgreementChecked}
          setIsAgreementChecked={setIsAgreementChecked}
        />
      ),
    },
    {
      page: 'confirm',
      component: <ConfirmationPage appointment={appointment} />,
    },
  ];

  const profileLoading = useSelector(state => isProfileLoading(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  // const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);
  const canSubmitMileage = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  if ((profileLoading && !userLoggedIn) || toggleIsLoading) {
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
          {cantFile && (
            <CantFilePage
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              setCantFile={setCantFile}
            />
          )}
          {isSubmissionError && <SubmissionErrorPage />}
          {!cantFile && !isSubmissionError && pageList[pageIndex].component}
        </div>
      </article>
    </Element>
  );
};

SubmitFlowWrapper.propTypes = {
  address: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    address: selectVAPResidentialAddress(state),
  };
}

export default connect(mapStateToProps)(SubmitFlowWrapper);
