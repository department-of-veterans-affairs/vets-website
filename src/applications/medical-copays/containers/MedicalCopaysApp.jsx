import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { isVAProfileServiceConfigured } from '@@vap-svc/util/local-vapsvc';
import LoadingSpinner from '../components/LoadingSpinner';
import { mcpFeatureToggle, cdpAccessToggle } from '../utils/helpers';
import AlertView from '../components/AlertView';
import { getStatements } from '../../combined-debt-portal/combined/actions/copays';
import {
  ALERT_TYPES,
  API_RESPONSES,
} from '../../combined-debt-portal/combined/utils/helpers';
import { debtMockResponse } from '../utils/mocks/mockDebtResponses';
import environment from '~/platform/utilities/environment';

export const fetchDebtResponseAsync = async () => {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  };
  try {
    const response = isVAProfileServiceConfigured()
      ? await apiRequest(`${environment.API_URL}/v0/debts`, options)
      : await debtMockResponse();

    if (response.errors) {
      return API_RESPONSES.ERROR;
    }
    return response.debts.length;
  } catch {
    return API_RESPONSES.ERROR;
  }
};

const MedicalCopaysApp = ({ children }) => {
  const showCDPComponents = useSelector(state => cdpAccessToggle(state));
  const [hasDebts, setHasDebts] = useState(null);
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
        const generateGetStatements = () => getStatements(dispatch);
        dispatch(generateGetStatements);
        fetchDebtResponseAsync().then(hasDebtsResponse =>
          setHasDebts(hasDebtsResponse),
        );
      }
    },
    [dispatch, userLoggedIn],
  );

  useEffect(
    () => {
      scrollToTop();
      setAlertType(null);
      if (showCDPComponents) {
        if (statements && !statements?.length) {
          setAlertType(ALERT_TYPES.ZERO);
        }
        if (error) {
          setAlertType(ALERT_TYPES.ERROR);
        }
      } else {
        if (statements && !statements?.length) {
          setAlertType('no-history');
        }
        if (error) {
          setAlertType('error');
        }
        if (error?.code === '403') {
          setAlertType('no-health-care');
        }
      }
    },
    [statements, error, showCDPComponents, hasDebts],
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
          <DowntimeNotification
            appTitle="Medical Copays Application"
            dependencies={[externalServices.mvi, externalServices.vbs]}
          >
            {alertType ? (
              <AlertView
                pathname={pathname}
                alertType={alertType}
                error={error}
                cdpToggle={showCDPComponents}
                hasDebts={hasDebts}
              />
            ) : (
              children
            )}
          </DowntimeNotification>
        </div>
      </div>
    </div>
  );
};

MedicalCopaysApp.propTypes = {
  children: PropTypes.object,
};

export default MedicalCopaysApp;
