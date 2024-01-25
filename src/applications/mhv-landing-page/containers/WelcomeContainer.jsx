import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalInformation } from '~/platform/user/profile/vap-svc/actions/personalInformation';
import {
  isInMPI,
  isLOA3,
  selectGreetingName,
  selectPersonalInformation,
} from '../selectors';
import Welcome from '../components/Welcome';

const WelcomeContainer = () => {
  const dispatch = useDispatch();
  const inMPI = useSelector(isInMPI);
  const loa3 = useSelector(isLOA3);
  const name = useSelector(selectGreetingName);
  const { loading } = useSelector(selectPersonalInformation);

  useEffect(
    () => {
      return inMPI && loa3 && dispatch(fetchPersonalInformation());
    },
    [dispatch, inMPI, loa3],
  );

  return <Welcome name={name} loading={loading} />;
};

export default WelcomeContainer;
