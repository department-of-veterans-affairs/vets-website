import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { goToNextPage, URLS } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { seeStaffMessageUpdated } from '../actions';
import DemographicsDisplay from '../../components/pages/demographics/DemographicsDisplay';

const Demographics = props => {
  const {
    demographics,
    isLoading,
    router,
    updateSeeStaffMessage,
    demographicsStatus,
  } = props;
  const { demographicsNeedsUpdate } = demographicsStatus;
  const findNextPage = useCallback(
    () => {
      goToNextPage(router, URLS.NEXT_OF_KIN);
    },
    [router],
  );
  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-demographic-information',
      });
      findNextPage();
    },
    [findNextPage],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-demographic-information',
      });
      const seeStaffMessage = (
        <>
          <p>Our staff can help you update your contact information.</p>
          <p className="vads-u-margin-bottom--0">
            If you don’t live at a fixed address right now, we’ll help you find
            the best way to stay connected with us.
          </p>
        </>
      );
      updateSeeStaffMessage(seeStaffMessage);
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router, updateSeeStaffMessage],
  );
  useEffect(
    () => {
      if (demographicsNeedsUpdate === false) {
        findNextPage();
      }
    },
    [demographicsNeedsUpdate, findNextPage],
  );
  if (isLoading) {
    return (
      <va-loading-indicator message="Loading your appointments for today" />
    );
  } else if (!demographics) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <>
        <DemographicsDisplay
          demographics={demographics}
          yesAction={yesClick}
          noAction={noClick}
          Footer={Footer}
        />
        <BackToHome />
      </>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateSeeStaffMessage: seeStaffMessage => {
      dispatch(seeStaffMessageUpdated(seeStaffMessage));
    },
  };
};

Demographics.propTypes = {
  demographics: PropTypes.object,
  isLoading: PropTypes.bool,
  router: PropTypes.object,
  updateSeeStaffMessage: PropTypes.func,
  demographicsStatus: PropTypes.object,
};

export default connect(
  null,
  mapDispatchToProps,
)(Demographics);
