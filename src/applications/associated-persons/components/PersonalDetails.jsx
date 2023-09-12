import React, { useState } from 'react';
import Edit from './Edit';
import Show from './Show';

const PersonalDetails = props => {
  let { variant } = props;
  const [edit, setEdit] = useState(false);

  const handleSubmit = () => {
    setEdit(!edit);
  }

  return (
    <>
      <h2>Next of kin information</h2>
      <p>
        Next of kin is who you'd like to represent you, your wishes for care,
        medical documentation, and benefits, if needed. You next of kin is often
        your closest living relative, like your spouse, child, parent, or sibling.
      </p>
      {edit && <Edit {...props} handleSubmit={handleSubmit} />}
      {!edit && <Show {...props} handleSubmit={handleSubmit} />}
    </>
  )
};

export default PersonalDetails;
