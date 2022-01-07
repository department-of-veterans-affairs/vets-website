import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, batch, useSelector } from 'react-redux';
import { api } from '../../api';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { URLS } from '../../utils/navigation/day-of';
import { useFormRouting } from '../../hooks/useFormRouting';
import {
  receivedEmergencyContact,
  receivedDemographicsData,
  receivedNextOfKinData,
  receivedMultipleAppointmentDetails,
  triggerRefresh,
  receivedDemographicsStatus,
} from '../../actions/day-of';
import { focusElement } from 'platform/utilities/ui';

import { makeSelectCheckInData } from '../hooks/selectors';

const withLoadedData = Component => {
  const Wrapped = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState();
    const { isSessionLoading, router } = props;
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

    const dispatch = useDispatch();
    const setSessionData = useCallback(
      (payload, token) => {
        batch(() => {
          const {
            appointments: appts,
            demographics: demo,
            patientDemographicsStatus,
          } = payload;
          dispatch(triggerRefresh(false));
          dispatch(receivedMultipleAppointmentDetails(appts, token));
          dispatch(receivedDemographicsStatus(patientDemographicsStatus));
          if (typeof demo !== 'undefined') {
            dispatch(receivedDemographicsData(demo));
            if ('nextOfKin1' in demo) {
              dispatch(receivedNextOfKinData(demo.nextOfKin1));
            }
            if ('emergencyContact' in demo) {
              dispatch(receivedEmergencyContact(demo.emergencyContact));
            }
          }
        });
      },
      [dispatch],
    );

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

export default withLoadedData;
