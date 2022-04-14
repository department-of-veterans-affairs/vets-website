import React from 'react';
import { useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import { signInServiceName } from 'platform/user/authentication/selectors';

export default function TransitionContainer({ children }) {
  const canView = useSelector(isLoggedIn);
  const isSignedInWithMHV = useSelector(signInServiceName);

  if (!canView || !['myhealthevet', 'mhv'].includes(isSignedInWithMHV)) {
    window.location = '/';
  }

  return <div className="transfer-account">{children}</div>;
}
