import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import scrollToTop from 'platform/utilities/ui/scrollToTop';
// import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';

// import LoadingSpinner from '../components/LoadingSpinner';
// import AlertView from '../components/AlertView';
// Copays (bills)
// import { mcpFeatureToggle } from '../utils/helpers';
// import { getStatements } from '../actions';
// Debts

const CombinedPortalApp = ({ children }) => {
  // const showMCP = useSelector(state => mcpFeatureToggle(state));
  // const userLoggedIn = useSelector(state => isLoggedIn(state));
  // const profileLoading = useSelector(state => isProfileLoading(state));
  // const fetchPending = useSelector(({ mcp }) => mcp.pending);
  // const statements = useSelector(({ combined }) => combined.mcp.statements);
  // const error = useSelector(({ mcp }) => mcp.error);
  // const [alertType, setAlertType] = useState(null);
  // const { pathname } = useLocation();
  // const dispatch = useDispatch();

  // Login check to get debts & bills
  // useEffect(
  //   () => {
  //     if (userLoggedIn) {
  //       // TODO
  //       // add a way to get debts if user is logged in as well
  //       // dispatch(getDebts());
  //       dispatch(getStatements());
  //     }
  //   },
  //   [dispatch, userLoggedIn],
  // );

  // MCP related Alerts
  // useEffect(
  //   () => {
  //     scrollToTop();
  //     setAlertType(null);
  //     // TODO: need to rework these Alerts b/c we don't just care about statements anymore
  //     if (statements && !statements?.length) {
  //       setAlertType('no-history');
  //     }
  //     if (error) {
  //       setAlertType('error');
  //     }
  //     if (error?.code === '403') {
  //       setAlertType('no-health-care');
  //     }
  //   },
  //   [statements, error],
  // );

  // if (
  //   showMCP === false ||
  //   (!profileLoading &&
  //     !userLoggedIn) /** check if app is enabled or redirect home */
  // ) {
  //   window.location.replace('/debt-and-bills');
  //   return <LoadingSpinner margin={5} />;
  // }

  // if (profileLoading || fetchPending) {
  //   return <LoadingSpinner margin={5} />;
  // }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--8">
          <DowntimeNotification
            appTitle="Debts and bills application"
            dependencies={[externalServices.mvi, externalServices.vbs]}
          >
            {/* {alertType ? (
              <AlertView
                pathname={pathname}
                alertType={alertType}
                error={error}
              />
            ) : (
              children
            )} */}
            {children}
          </DowntimeNotification>
        </div>
      </div>
    </div>
  );
};

CombinedPortalApp.propTypes = {
  children: PropTypes.object,
};

export default CombinedPortalApp;
