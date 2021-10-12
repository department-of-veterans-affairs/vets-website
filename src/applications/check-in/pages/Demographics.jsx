import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { receivedMultipleAppointmentDetails } from '../actions';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

import { goToNextPage, URLS } from '../utils/navigation';
import { api } from '../api';

const Demographics = props => {
  const {
    isUpdatePageEnabled,
    router,
    context,
    setMultipleAppointments,
  } = props;
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { token } = context;

  useEffect(
    () => {
      focusElement('h1');
      setIsLoadingData(true);
      api.v2
        .getCheckInData(token)
        .then(json => {
          const { payload } = json;
          // TODO: update to store demographics in redux. This is a different ticket
          setMultipleAppointments(payload.appointments, token);
          setIsLoadingData(false);
          focusElement('h1');
        })
        .catch(() => {
          goToNextPage(router, URLS.ERROR);
        });
    },
    [router, setMultipleAppointments, token],
  );

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-demographic-information',
      });
      if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    },
    [isUpdatePageEnabled, router],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-demographic-information',
      });
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router],
  );
  if (isLoadingData) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  }
  return (
    <>
      <h1>Is your contact information correct?</h1>
      <button
        onClick={() => yesClick()}
        className={'usa-button-secondary'}
        data-testid="yes-button"
      >
        Yes
      </button>
      <button
        onClick={() => noClick()}
        className={'usa-button-secondary'}
        data-testid="no-button"
      >
        No
      </button>
      <Footer />
      <BackToHome />
    </>
  );
};

const mapStateToProps = state => {
  return {
    context: state.checkInData.context,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setMultipleAppointments: (data, token) =>
      dispatch(receivedMultipleAppointmentDetails(data, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Demographics);
