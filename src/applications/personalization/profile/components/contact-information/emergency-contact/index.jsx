import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEmergencyContacts } from '@@profile/actions';
import { selectEmergencyContacts } from '@@profile/selectors';

import Edit from './Edit';
import Show from './Show';
import None from './None';

import Loading from '../Loading';

const EmergencyContact = () => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const { data, loading, error } = useSelector(selectEmergencyContacts);

  useEffect(
    () => !data && !loading && !error && dispatch(fetchEmergencyContacts()),
    [data, dispatch, loading, error],
  );

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  if (loading) return <Loading />;

  // const emergencyContact = data[0].attributes;
  const [emergencyContact] = data || [];
  const { attributes } = emergencyContact || {};
  // const attributes = {};
  const hasEC = JSON.stringify(attributes) !== '{}';

  return (
    <section className="emergency-contacts-section">
      <h2>Emergency Contact</h2>

      <div className="vads-u-color--gray">
        This person may be contacted in the event of an emergency.
      </div>

      <va-additional-info
        trigger="How to update your emergency contact"
        uswds
        disable-border
      >
        <p>
          To add add or update an emergency contact, please call the Help Desk
          at 844-698-2311.
        </p>
      </va-additional-info>

      {editing && <Edit {...attributes} handleCancel={handleCancel} />}
      {!editing && hasEC && <Show {...attributes} handleEdit={handleEdit} />}
      {!hasEC && <None />}
    </section>
  );
};

export default EmergencyContact;
