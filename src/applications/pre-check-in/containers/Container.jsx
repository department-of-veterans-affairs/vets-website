/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import environment from 'platform/utilities/environment';

import { api } from '../api';

import App from './App';

const Container = ({ location, children }) => {
  const getAppointmentIdFromUrl = (window, key = 'id') => {
    if (!window) return null;
    if (!window.location) return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  };
  const dispatch = useDispatch();
  useEffect(
    () => {
      const urlId = getAppointmentIdFromUrl(window);
      api.v0.getSession(urlId).then(json => {
        // console.log({ json });
        dispatch({
          type: 'TOKEN_LOADED',
          payload: json,
        });
      });
    },
    [dispatch],
  );

  const data = useSelector(state => ({ user: state.user }));
  const { user } = data;

  return (
    <>
      {/* <RequiredLoginView user={user} verify={!environment.isLocalhost()}> */}
      <App location={location}>{children}</App>
      {/* </RequiredLoginView> */}
    </>
  );
};

export default Container;
