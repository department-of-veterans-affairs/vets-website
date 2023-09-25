import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEmergencyContacts } from '../../actions';
import { selectEmergencyContacts } from '../../selectors';

import Edit from './Edit';
import Show from './Show';
import None from './None';

const EmergencyContact = () => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const { data, loading, error } = useSelector(selectEmergencyContacts);

  useEffect(
    () => {
      if (!data && !loading && !error) dispatch(fetchEmergencyContacts());
    },
    [data, dispatch, loading, error],
  );

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  if (loading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="emergency-contacts-loading"
          message="Please wait..."
        />
      </div>
    );
  }

  // const emergencyContact = data[0].attributes;
  const [emergencyContact] = data || [];
  const { attributes } = emergencyContact || {};
  // const attributes = {};
  const hasEC = JSON.stringify(attributes) !== '{}';

  return (
    <section className="emergency-contacts-section">
      <h2>Emergency Contact</h2>

      {editing && <Edit {...attributes} handleCancel={handleCancel} />}
      {!editing && hasEC && <Show {...attributes} handleEdit={handleEdit} />}
      {!hasEC && <None />}
    </section>
  );
};

export default EmergencyContact;
