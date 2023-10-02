import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchNextOfKin } from '@@profile/actions';
import { selectNextOfKin } from '@@profile/selectors';

import Contact from './Contact';
import Loading from './Loading';

const NextOfKin = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(selectNextOfKin);

  useEffect(() => !data && !loading && !error && dispatch(fetchNextOfKin()), [
    data,
    dispatch,
    loading,
    error,
  ]);

  // Select the first record returned from the API. Perhaps move this the reducer.
  const [nextOfKin] = data || [];
  const { attributes } = nextOfKin || {};

  return (
    <>
      {loading && <Loading testId="nok-loading" />}
      {!loading && <Contact {...attributes} />}
    </>
  );
};

export default NextOfKin;
