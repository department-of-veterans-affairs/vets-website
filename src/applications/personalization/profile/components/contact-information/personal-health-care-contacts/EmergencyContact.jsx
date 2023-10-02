import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEmergencyContacts } from '@@profile/actions';
import { selectEmergencyContacts } from '@@profile/selectors';

import Contact from './Contact';
import Loading from './Loading';

const EmergencyContact = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(selectEmergencyContacts);

  useEffect(
    () => !data && !loading && !error && dispatch(fetchEmergencyContacts()),
    [data, dispatch, loading, error],
  );

  // Select the first record returned from the API.
  const [emergencyContact] = data || [];
  const { attributes } = emergencyContact || {};

  return (
    <>
      {loading && <Loading testId="ec-loading" />}
      {!loading && <Contact {...attributes} />}
    </>
  );
};

export default EmergencyContact;
