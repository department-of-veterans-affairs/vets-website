import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from '../selectors/user';
import { SIGN_OUT_URL } from '../constants';

export default function UserNav() {
  const user = useSelector(selectUser);

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <>
      <div>{`${user.firstName} ${user.lastName}`}</div>

      <a href={SIGN_OUT_URL}>Sign out</a>
    </>
  );
}
