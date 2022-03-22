import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, batch } from 'react-redux';
import propTypes from 'prop-types';

import { createSetSession } from '../actions/authentication';
import { createInitFormAction } from '../actions/navigation';
import { setVeteranData, updateFormAction } from '../actions/pre-check-in';

// import { makeSelectForm, makeSelectUserData } from '../selectors';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { useFormRouting } from '../hooks/useFormRouting';

// import { URLS } from '../utils/navigation';

import { createForm } from '../utils/navigation/pre-check-in';

import { APP_NAMES } from '../utils/appConstants';

import { api } from '../api';

const withSession = (Component, options = {}) => {
  const WrappedComponent = props => {
    const { isPreCheckIn } = options;
    const { router } = props;
    const dispatch = useDispatch();
    // const selectForm = useMemo(makeSelectForm, []);
    // const form = useSelector(selectForm);

    // const selectUserData = useMemo(makeSelectUserData, []);
    // const { login } = useSelector(selectUserData);
    // const { currentlyLoggedIn } = login || {};
    // console.log('data', { currentlyLoggedIn });

    const { jumpToPage, goToErrorPage } = useFormRouting(router);
    const { getCurrentToken } = useSessionStorage(isPreCheckIn);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(
      'checking for session',
    );

    const setSession = useCallback(
      (token, permissions) => {
        dispatch(createSetSession({ token, permissions }));
      },
      [dispatch],
    );

    const initForm = useCallback(
      (pages, firstPage) => {
        dispatch(createInitFormAction({ pages, firstPage }));
      },
      [dispatch],
    );

    const dispatchSetVeteranData = useCallback(
      payload => {
        batch(() => {
          dispatch(setVeteranData({ ...payload }));
          dispatch(updateFormAction({ ...payload }));
        });
      },
      [dispatch],
    );

    useEffect(
      () => {
        // console.log('withSession');
        const token = getCurrentToken(window)?.token;
        const params = router.location.query;
        // console.log('ws', { params });
        // TODO: refine this if to include both withAuth and withForm
        // const isLoggedIn = currentlyLoggedIn;
        if (token && params.editingPage) {
          setIsLoading(true);
          // console.log('editing some fields');
          // need to load sessions
          api.v2
            .getSession({ token, checkInType: APP_NAMES.PRE_CHECK_IN })
            .then(session => {
              // console.log({ session });
              // init form
              const pages = createForm();
              const firstPage = pages[0];
              initForm(pages, firstPage);
              // insert session in redux
              setSession(session.uuid, session.permissions);
              setLoadingMessage('found session, loading your details');
              // // need to GET the data
              api.v2.getPreCheckInData(session.uuid).then(data => {
                // console.log({ data });
                setLoadingMessage('found your details, restoring form');
                // insert data in redux
                dispatchSetVeteranData(data.payload);

                // redirect to editing page
                setIsLoading(false);
              });
            });
        } else {
          setIsLoading(false);
        }
      },
      [
        goToErrorPage,
        jumpToPage,
        getCurrentToken,
        router.location.query,
        initForm,
        setSession,
        dispatchSetVeteranData,
      ],
    );

    if (isLoading) {
      return (
        <>
          <va-loading-indicator message={loadingMessage} />
        </>
      );
    }

    return (
      <>
        {/* Allowing for HOC */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} />
      </>
    );
  };

  WrappedComponent.propTypes = {
    router: propTypes.object,
  };

  return WrappedComponent;
};

export default withSession;
