import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mcpFeatureToggle } from '../utils/helpers';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStatements } from '../actions';

const MedicalCopaysApp = ({ children }) => {
  const showMCP = useSelector(state => mcpFeatureToggle(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const profileLoading = useSelector(state => isProfileLoading(state));
  const fetchPending = useSelector(({ mcp }) => mcp.pending);

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getStatements());
      }
    },
    [userLoggedIn], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (showMCP === false || (!profileLoading && !userLoggedIn)) {
    window.location.replace('/health-care/pay-copay-bill');
    return <LoadingSpinner margin={5} />;
  }

  if (profileLoading || fetchPending) {
    return <LoadingSpinner margin={5} />;
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="usa-width-three-fourths medium-8 columns">{children}</div>
    </div>
  );
};

export default MedicalCopaysApp;
