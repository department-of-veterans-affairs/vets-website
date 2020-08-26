import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';
import * as actions from '../appointment-list/redux/actions';
import { FETCH_STATUS } from '../utils/constants';
import { selectExpressCare } from '../utils/selectors';
import ErrorMessage from '../components/ErrorMessage';

function NewExpressCareRequestLayout({
  children,
  windowsStatus,
  allowRequests,
  fetchExpressCareWindows,
}) {
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
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--8">
      <Breadcrumbs>
        <Link to="new-express-care-request">Express Care request</Link>
      </Breadcrumbs>
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
            Express Care Request
          </span>
          {windowsStatus === FETCH_STATUS.succeeded &&
            allowRequests &&
            children}
          {windowsStatus === FETCH_STATUS.failure && <ErrorMessage />}
          {(windowsStatus === FETCH_STATUS.loading ||
            windowsStatus === FETCH_STATUS.notStarted) && (
            <LoadingIndicator message="Checking Express Care availability" />
          )}
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  fetchExpressCareWindows: actions.fetchExpressCareWindows,
};

export default connect(
  selectExpressCare,
  mapDispatchToProps,
)(NewExpressCareRequestLayout);
