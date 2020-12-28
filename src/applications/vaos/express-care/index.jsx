import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
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

function NewExpressCareRequestSection({
  windowsStatus,
  allowRequests,
  fetchExpressCareWindows,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (windowsStatus === FETCH_STATUS.notStarted) {
      fetchExpressCareWindows();
    }

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    const { pathname } = location;

    if (
      !pathname.endsWith('new-express-care-request') &&
      !pathname.endsWith('confirmation')
    ) {
      history.replace('/new-express-care-request');
    }
  }, []);

  useEffect(
    () => {
      if (windowsStatus === FETCH_STATUS.succeeded && !allowRequests) {
        history.push('/');
      }
    },
    [history, windowsStatus, allowRequests],
  );

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
