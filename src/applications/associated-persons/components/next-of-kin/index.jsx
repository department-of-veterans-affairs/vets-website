import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchNextOfKin } from '../../actions';
import { selectNextOfKin } from '../../selectors';

import Edit from './Edit';
import Show from './Show';

const NextOfKin = () => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const { data, loading, error } = useSelector(selectNextOfKin);

  useEffect(
    () => {
      if (!data && !loading && !error) dispatch(fetchNextOfKin());
    },
    [data, loading, error],
  );

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  if (loading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="next-of-kin-loading"
          message="Please wait..."
        />
      </div>
    );
  }

  // const nextOfKin = data[0].attributes;
  const [nextOfKin] = data || [];
  const { attributes } = nextOfKin || {};

  return (
    <section className="next-of-kin-section">
      <h2>Next of Kin</h2>

      {editing ? (
        <Edit {...attributes} handleCancel={handleCancel} />
      ) : (
        <Show {...attributes} handleEdit={handleEdit} />
      )}
    </section>
  );
};

export default NextOfKin;
