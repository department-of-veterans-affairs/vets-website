import React from 'react';
import { useSelector } from 'react-redux';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import App from './App';

const requiredServices = [
  backendServices.USER_PROFILE,
  // backendServices.VA_PROFILE,
];

const Authorization = () => {
  const { user } = useSelector(fullState => fullState);
  return (
    <RequiredLoginView useSiS user={user} serviceRequired={requiredServices}>
      <App />
    </RequiredLoginView>
  );
};

export default Authorization;
