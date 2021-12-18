import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { mcpFeatureToggle, renderBreadcrumbs } from '../utils/helpers';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertView from '../components/AlertView';
import { getStatements } from '../actions';

const MedicalCopaysApp = ({ children }) => {
  const showMCP = useSelector(state => mcpFeatureToggle(state));
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const profileLoading = useSelector(state => isProfileLoading(state));
  const fetchPending = useSelector(({ mcp }) => mcp.pending);
  const statements = useSelector(({ mcp }) => mcp.statements);
  const error = useSelector(({ mcp }) => mcp.error);
  const [alertType, setAlertType] = useState(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (userLoggedIn) {
        dispatch(getStatements());
      }
    },
    [userLoggedIn], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      scrollToTop();
      setAlertType(null);
      if (statements && !statements?.length) {
        setAlertType('no-history');
      }
      if (error?.code === '403') {
        setAlertType('no-health-care');
      }
      if (error) {
        setAlertType('error');
      }
    },
    [fetchPending, profileLoading, error, statements],
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
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--8">
          <Breadcrumbs className="vads-u-font-family--sans no-wrap">
            {renderBreadcrumbs(pathname)}
          </Breadcrumbs>
          {alertType ? (
            <AlertView
              pathname={pathname}
              alertType={alertType}
              error={error}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalCopaysApp;
