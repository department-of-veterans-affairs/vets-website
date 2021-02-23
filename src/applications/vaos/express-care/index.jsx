import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import * as actions from '../appointment-list/redux/actions';
import expressCareReducer from './redux/reducer';
import { FETCH_STATUS } from '../utils/constants';
import { selectExpressCareAvailability } from '../appointment-list/redux/selectors';
import FormLayout from './components/FormLayout';
import ExpressCareReasonPage from './components/ExpressCareReasonPage';
import ExpressCareDetailsPage from './components/ExpressCareDetailsPage';
import ExpressCareConfirmationPage from './components/ExpressCareConfirmationPage';
import ExpressCareInfoPage from './components/ExpressCareInfoPage';
import ExpressCareRequestLimitPage from './components/ExpressCareRequestLimitPage';
import ErrorMessage from '../components/ErrorMessage';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';

function NewExpressCareRequestSection({
  windowsStatus,
  allowRequests,
  useNewFlow,
  fetchExpressCareWindows,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  useManualScrollRestoration();

  useEffect(() => {
    if (windowsStatus === FETCH_STATUS.notStarted) {
      fetchExpressCareWindows();
    }
  }, []);

  useEffect(
    () => {
      if (
        !useNewFlow ||
        (windowsStatus === FETCH_STATUS.succeeded && !allowRequests)
      ) {
        history.push('/');
      }
    },
    [history, windowsStatus, allowRequests, useNewFlow],
  );
  useFormUnsavedDataWarning();

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !location.pathname.endsWith('new-express-care-request') &&
      !location.pathname.endsWith('confirmation'),
    enabled:
      useNewFlow && windowsStatus === FETCH_STATUS.succeeded && allowRequests,
  });

  if (shouldRedirectToStart) {
    return <Redirect to="/new-express-care-request" />;
  }

  return (
    <FormLayout>
      {(windowsStatus === FETCH_STATUS.loading ||
        windowsStatus === FETCH_STATUS.notStarted) && (
        <LoadingIndicator message="Checking Express Care availability" />
      )}
      {windowsStatus === FETCH_STATUS.succeeded &&
        allowRequests && (
          <Switch>
            <Route
              path={`${match.url}/select-reason`}
              component={ExpressCareReasonPage}
            />
            <Route
              path={`${match.url}/additional-details`}
              component={ExpressCareDetailsPage}
            />
            <Route
              path={`${match.url}/confirmation`}
              component={ExpressCareConfirmationPage}
            />
            <Route
              path={`${match.url}/request-limit`}
              component={ExpressCareRequestLimitPage}
            />
            <Route path="/" component={ExpressCareInfoPage} />
          </Switch>
        )}
      {windowsStatus === FETCH_STATUS.failed && <ErrorMessage />}
    </FormLayout>
  );
}

const mapDispatchToProps = {
  fetchExpressCareWindows: actions.fetchExpressCareWindows,
};

export const NewExpressCareRequest = connect(
  selectExpressCareAvailability,
  mapDispatchToProps,
)(NewExpressCareRequestSection);

export const reducer = expressCareReducer;
