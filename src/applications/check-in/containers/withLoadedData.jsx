import React, { useEffect, useState } from 'react';
import { connect, batch } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import { getCurrentToken } from '../utils/session';
import { api } from '../api';
import {
  receivedDemographicsData,
  receivedMultipleAppointmentDetails,
} from '../actions';

const withLoadedData = WrappedComponent => props => {
  const { checkInData, router } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [jsonData, setJsonData] = useState({});
  const { appointments, context } = checkInData;
  useEffect(
    () => {
      // check if appointments is empty or if a refresh is staged
      const session = getCurrentToken(window);
      const { token } = session;

      setIsLoading(true);
      api.v2
        .getCheckInData(token)
        .then(json => {
          // console.log('loaded api data HOC', json);
          setJsonData(json.payload);
          setIsLoading(false);
        })
        .catch(() => {
          goToNextPage(router, URLS.ERROR);
        });

      // if its empty, get the current session token
      // load data from the API
    },
    [appointments, router, context.shouldRefresh],
  );
  return (
    <>
      <WrappedComponent {...props} isLoading={isLoading} {...jsonData} />
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
