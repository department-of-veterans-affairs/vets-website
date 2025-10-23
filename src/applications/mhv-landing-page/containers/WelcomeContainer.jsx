import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isInMPI, isLOA3, selectGreetingName } from '../selectors';
import Welcome from '../components/Welcome';

const WelcomeContainer = () => {
  const dispatch = useDispatch();
  const inMPI = useSelector(isInMPI);
  const loa3 = useSelector(isLOA3);
  const name = useSelector(selectGreetingName);

  useEffect(
    () => {
      return inMPI && loa3;
    },
    [dispatch, inMPI, loa3],
  );

  return <Welcome name={name} />;
};

export default WelcomeContainer;
