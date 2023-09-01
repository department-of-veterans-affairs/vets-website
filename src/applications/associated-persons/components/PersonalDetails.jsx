import React from 'react';
import Edit from './Edit';
import Show from './Show';

const PersonalDetails = props => {
  let { variant } = props;

  return (
    <>

      {/* <Edit {...props} /> */}
      <Show {...props} />
    </>
  )
};

export default PersonalDetails;
