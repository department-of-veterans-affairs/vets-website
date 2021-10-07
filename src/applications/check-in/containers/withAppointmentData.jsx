import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';

const withAppointmentData = WrappedComponent => props => {
  const { checkInData, router } = props;
  const { appointments } = checkInData;
  useEffect(
    () => {
      // if appointments doesn't exist or is empty or the first element doesnt
      if (!appointments || !appointments[0]) {
        const session = getCurrentToken(window);
        if (session) {
          const { token } = session;
          goToNextPage(router, URLS.LANDING, { url: { id: token } });
        } else {
          goToNextPage(router, URLS.ERROR);
        }
      }
    },
    [appointments, router],
  );
  if (!appointments || appointments.length === 0) {
    return <></>;
  }
  return (
    <>
      <WrappedComponent {...props} />
    </>
  );
};

const mapStateToProps = state => ({
  checkInData: state.checkInData,
});

const composedWrapper = compose(
  connect(mapStateToProps),
  withAppointmentData,
);
export default composedWrapper;
