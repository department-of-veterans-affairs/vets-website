import React from 'react';
import { useSelector } from 'react-redux';

import { SIGN_OUT_URL } from '../../../../constants';
import { selectUser } from '../../../../selectors/user';

const UserNav = () => {
  const { isLoading, profile } = useSelector(selectUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Not signed in</div>;
  }

  return (
    <>
      <div>{`${profile.firstName} ${profile.lastName}`}</div>

      <a href={SIGN_OUT_URL}>Sign out</a>
    </>
  );
};

export default UserNav;
