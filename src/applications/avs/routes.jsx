import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { isLOA1 } from '~/platform/user/selectors';
import ErrorBoundary from './components/ErrorBoundary';
import Avs from './containers/Avs';

// Redirect an unverified user to the My Health landing page
const AuthGuard = ({ children }) => {
  const isUnverified = useSelector(isLOA1);
  if (isUnverified) {
    return <Redirect to="/my-health" />;
  }
  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

const ErrorBoundaryWrapper = props => (
  <ErrorBoundary>
    <AuthGuard>
      <Avs {...props} />
    </AuthGuard>
  </ErrorBoundary>
);

const routes = (
  <Switch>
    <Route exact path="/:id" key="/:id">
      <ErrorBoundaryWrapper />
    </Route>
    <Route key="404">
      <PageNotFound />
    </Route>
  </Switch>
);

export default routes;
