import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectProfileContacts } from '@@profile/selectors';
import { fetchProfileContacts as fetchProfileContactsFn } from '@@profile/actions';
import { focusElement } from '~/platform/utilities/ui';
import { isVAPatient } from '~/platform/user/selectors';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import Contacts from './Contacts';
import Headline from '../ProfileSectionHeadline';
import Loading from './Loading';
import LoadFail from '../alerts/LoadFail';
import NonVAPatientMessage from './NonVAPatientMessage';

const PAGE_TITLE = 'Personal Health Care Contacts | Veterans Affairs';

const PersonalHealthCareContacts = ({
  fetchProfileContacts = fetchProfileContactsFn,
}) => {
  const dispatch = useDispatch();
  const vaPatient = useSelector(isVAPatient);
  const { data, loading, error } = useSelector(selectProfileContacts);

  useEffect(
    () => vaPatient && dispatch(fetchProfileContacts()),
    [dispatch, fetchProfileContacts, vaPatient],
  );

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  useEffect(() => !loading && focusElement('[data-focus-target]'), [loading]);

  return (
    <>
      <Headline>Health care contacts</Headline>
      <DowntimeNotification
        appTitle="health care contacts page"
        dependencies={[externalServices.VAPRO_HEALTH_CARE_CONTACTS]}
      >
        {vaPatient ? (
          <>
            {error && <LoadFail />}
            {!error && loading && <Loading />}
            {!error && !loading && <Contacts data={data} />}
          </>
        ) : (
          <NonVAPatientMessage />
        )}
      </DowntimeNotification>
    </>
  );
};

PersonalHealthCareContacts.propTypes = {
  fetchProfileContacts: PropTypes.func,
};

export default PersonalHealthCareContacts;
