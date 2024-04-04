import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectProfileContacts } from '@@profile/selectors';
import { fetchProfileContacts as fetchProfileContactsFn } from '@@profile/actions';
import { focusElement } from '~/platform/utilities/ui';

import Contacts from './Contacts';
import Loading from './Loading';
import LoadFail from '../alerts/LoadFail';
import NonVAPatientMessage from './NonVAPatientMessage';
import { isVAPatient } from '~/platform/user/selectors';

const PAGE_TITLE = 'Personal Health Care Contacts | Veterans Affairs';

const PersonalHealthCareContacts = ({
  fetchProfileContacts = fetchProfileContactsFn,
}) => {
  const dispatch = useDispatch();
  const vaPatient = useSelector(isVAPatient);
  const { data, loading, error } = useSelector(selectProfileContacts);

  useEffect(() => vaPatient && dispatch(fetchProfileContacts()), [
    dispatch,
    fetchProfileContacts,
    vaPatient,
  ]);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  useEffect(() => !loading && focusElement('[data-focus-target]'), [loading]);

  return (
    <div className="vads-u-padding-bottom--4">
      <h1
        tabIndex="-1"
        className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Personal health care contacts
      </h1>
      {vaPatient ? (
        <>
          {error && <LoadFail />}
          {!error && loading && <Loading />}
          {!error && !loading && <Contacts data={data} />}
        </>
      ) : (
        <NonVAPatientMessage />
      )}
    </div>
  );
};

PersonalHealthCareContacts.propTypes = {
  fetchProfileContacts: PropTypes.func,
};

export default PersonalHealthCareContacts;
