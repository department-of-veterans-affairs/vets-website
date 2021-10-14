import React, { useEffect, useState } from 'react';
import { connect, batch } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';
import { api } from '../api';
import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
} from '../actions';

const withLoadedData = WrappedComponent => props => {
  const { checkInData, router, setSessionData, isSessionLoading } = props;
  const [isLoading, setIsLoading] = useState();
  const { context, appointments, demographics } = checkInData;

  useEffect(
    () => {
      let isCancelled = false;
      const session = getCurrentToken(window);
      if (!context || !session) {
        goToNextPage(router, URLS.ERROR);
      }
      // check if appointments is empty or if a refresh is staged
      const { token } = session;
      // console.log('HOC', { context });
      if (Object.keys(context).length === 0 || context.shouldRefresh) {
        // check for 'read.full permissions?
        setIsLoading(true);
        api.v2
          .getCheckInData(token)
          .then(json => {
            if (!isCancelled) {
              // console.log('loaded api data HOC', json);
              setSessionData(json.payload, token);
              setIsLoading(false);
            }
          })
          .catch(() => {
            goToNextPage(router, URLS.ERROR);
          });
      }

      return () => {
        isCancelled = true;
      };
    },
    [appointments, router, context, setSessionData, isSessionLoading],
  );
  return (
    <>
      <WrappedComponent
        {...props}
        isLoading={isLoading}
        demographics={demographics || {}}
        appointments={appointments || []}
        context={context || {}}
      />
    </>
  );
};

const mapStateToProps = state => ({
  checkInData: state.checkInData,
});
const mapDispatchToProps = dispatch => {
  return {
    setSessionData: (payload, token) => {
      batch(() => {
        const { appointments, demographics } = payload;
        dispatch(triggerRefresh(false));
        dispatch(receivedMultipleAppointmentDetails(appointments, token));
        dispatch(receivedDemographicsData(demographics));
      });
    },
  };
};

const composedWrapper = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLoadedData,
);
export default composedWrapper;
