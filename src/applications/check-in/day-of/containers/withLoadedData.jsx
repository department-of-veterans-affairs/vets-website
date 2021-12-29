import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, batch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { api } from '../../api';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { URLS } from '../utils/navigation';
import { useFormRouting } from '../../hooks/useFormRouting';
import {
  receivedEmergencyContact,
  receivedDemographicsData,
  receivedNextOfKinData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  receivedDemographicsStatus,
} from '../actions';
import { focusElement } from 'platform/utilities/ui';

import { makeSelectCheckInData } from '../hooks/selectors';

const withLoadedData = Component => {
  const Wrapped = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState();
    const { isSessionLoading, router, setSessionData } = props;
    const { goToErrorPage } = useFormRouting(router, URLS);
    const selectCheckInData = useMemo(makeSelectCheckInData, []);
    const checkInData = useSelector(selectCheckInData);
    const { getCurrentToken } = useSessionStorage(false);
    const {
      context,
      appointments,
      demographics,
      nextOfKin,
      demographicsStatus,
      emergencyContact,
    } = checkInData;

    useEffect(
      () => {
        let isCancelled = false;
        const session = getCurrentToken(window);
        if (!context || !session) {
          goToErrorPage();
        } else {
          // check if appointments is empty or if a refresh is staged
          const { token } = session;

          if (
            Object.keys(context).length === 0 ||
            context.shouldRefresh ||
            appointments.length === 0
          ) {
            setIsLoading(true);

            api.v2
              .getCheckInData(token)
              .then(json => {
                if (!isCancelled) {
                  setSessionData(json.payload, token);
                  setIsLoading(false);
                  focusElement('h1');
                }
              })
              .catch(() => {
                goToErrorPage();
              });
          }
        }
        return () => {
          isCancelled = true;
        };
      },
      [
        appointments,
        router,
        context,
        setSessionData,
        isSessionLoading,
        getCurrentToken,
        goToErrorPage,
      ],
    );
    return (
      <>
        <Component
          {...props}
          isLoading={isLoading}
          demographics={demographics || {}}
          nextOfKin={nextOfKin || {}}
          appointments={appointments || []}
          context={context || {}}
          emergencyContact={emergencyContact || {}}
          demographicsStatus={demographicsStatus || {}}
        />
      </>
    );
  };

  Wrapped.propTypes = {
    checkInData: PropTypes.object,
    isSessionLoading: PropTypes.bool,
    router: PropTypes.object,
    setSessionData: PropTypes.func,
  };

  return Wrapped;
};

const mapDispatchToProps = dispatch => {
  return {
    setSessionData: (payload, token) => {
      batch(() => {
        const {
          appointments,
          demographics,
          patientDemographicsStatus,
        } = payload;
        dispatch(triggerRefresh(false));
        dispatch(receivedMultipleAppointmentDetails(appointments, token));
        dispatch(receivedDemographicsStatus(patientDemographicsStatus));
        if (typeof demographics !== 'undefined') {
          dispatch(receivedDemographicsData(demographics));
          if ('nextOfKin1' in demographics) {
            dispatch(receivedNextOfKinData(demographics.nextOfKin1));
          }
          if ('emergencyContact' in demographics) {
            dispatch(receivedEmergencyContact(demographics.emergencyContact));
          }
        }
      });
    },
  };
};

const composedWrapper = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withLoadedData,
);
export default composedWrapper;
