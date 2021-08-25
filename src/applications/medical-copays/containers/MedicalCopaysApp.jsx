import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mcpFeatureToggle } from '../utils/helpers';
import { getStatements } from '../actions';
import { isLoggedIn } from 'platform/user/selectors';

const MedicalCopaysApp = ({ children }) => {
  const showMCP = useSelector(state => mcpFeatureToggle(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  // const profileLoading = useSelector(state => isProfileLoading(state));
  // console.log('profileLoading: ', profileLoading);

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getStatements());
      }
    },
    [userLoggedIn], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (showMCP === false) {
    return window.location.replace('/');
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="usa-width-three-fourths medium-8 columns">{children}</div>
    </div>
  );
};

export default MedicalCopaysApp;
