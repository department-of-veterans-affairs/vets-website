import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchNextOfKin } from '../../actions';
import { selectNextOfKin } from '../../selectors';

import Edit from './Edit';
import Show from './Show';

import Loading from '../Loading';

const NextOfKin = () => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const { data, loading, error } = useSelector(selectNextOfKin);

  useEffect(() => !data && !loading && !error && dispatch(fetchNextOfKin()), [
    data,
    loading,
    error,
  ]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  if (loading) <Loading />;

  // const nextOfKin = data[0].attributes;
  const [nextOfKin] = data || [];
  const { attributes } = nextOfKin || {};

  return (
    <section className="next-of-kin-section">
      <h2>Next of Kin</h2>

      <div className="vads-u-color--gray">
        This person is who you’d like to represent your wishes for care and
        medical documentation if needed.
      </div>

      <va-additional-info
        trigger="More information and how to update your next of kin"
        uswds
        disable-border
      >
        <p>To add a next of kin, please call the Help Desk at 844-698-2311.</p>
      </va-additional-info>

      {editing ? (
        <Edit {...attributes} handleCancel={handleCancel} />
      ) : (
        <Show {...attributes} handleEdit={handleEdit} />
      )}
    </section>
  );
};

export default NextOfKin;
