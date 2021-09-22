import React from 'react';
import { useSelector } from 'react-redux';
import { mcpFeatureToggle } from '../utils/helpers';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const MedicalCopaysApp = ({ children }) => {
  const showMCP = useSelector(state => mcpFeatureToggle(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const profileLoading = useSelector(state => isProfileLoading(state));
  const fetchPending = useSelector(({ mcp }) => mcp.pending);

  // disabled api call until data is available
  // const dispatch = useDispatch();

  // useEffect(
  //   () => {
  //     if (userLoggedIn) {
  //       dispatch(getStatements());
  //     }
  //   },
  //   [userLoggedIn], // eslint-disable-line react-hooks/exhaustive-deps
  // );

  if (showMCP === false || (!profileLoading && !userLoggedIn)) {
    window.location.replace('/health-care/pay-copay-bill');
    return (
      <div className="vads-u-margin--5">
        <LoadingIndicator message="Please wait while we load the application for you." />
      </div>
    );
  }

  if (profileLoading || fetchPending) {
    return (
      <div className="vads-u-margin--5">
        <LoadingIndicator message="Please wait while we load the application for you." />
      </div>
    );
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="usa-width-three-fourths medium-8 columns">{children}</div>
    </div>
  );
};

export default MedicalCopaysApp;
