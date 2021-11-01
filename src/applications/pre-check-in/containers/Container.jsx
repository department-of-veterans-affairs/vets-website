import React from 'react';
import { useSelector } from 'react-redux';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import environment from 'platform/utilities/environment';

import App from './App';

const Container = ({ location, children }) => {
  const data = useSelector(state => ({ user: state.user }));
  const { user } = data;

  return (
    <>
      <RequiredLoginView user={user} verify={!environment.isLocalhost()}>
        <App location={location}>{children}</App>
      </RequiredLoginView>
    </>
  );
};

export default Container;
