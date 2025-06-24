import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { isLoggedIn } from 'platform/user/selectors';
import { addStyleToShadowDomOnPages } from '../helpers/index';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { SIGN_IN_URL } from '../constants';
import { fetchUser } from '../actions/user';
import { selectIsUserLoading } from '../selectors/user';
import { selectShouldGoToSignIn } from '../selectors/navigation';
import AccessTokenManager from './AccessTokenManager';

const App = ({ children }) => {
  const {
    TOGGLE_NAMES: { accreditedRepresentativePortalFrontend: appToggleKey },
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  const isAppEnabled = useToggleValue(appToggleKey);
  const isProduction = window.Cypress || environment.isProduction();
  const shouldExitApp = isProduction && !isAppEnabled;

  const isAppToggleLoading = useToggleLoadingValue(appToggleKey);
  const shouldGoToSignIn = useSelector(selectShouldGoToSignIn);
  const isUserLoading = useSelector(selectIsUserLoading);
  const userLoggedIn = useSelector(state => isLoggedIn(state));

  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      ['va-memorable-date'],
      '#dateHint {display: none} .usa-form-group--month-select {width: 159px}',
    );
  });

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchUser()), [dispatch]);

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (shouldExitApp) {
    window.location.replace('/');
    return null;
  }

  if (shouldGoToSignIn) {
    window.location.assign(SIGN_IN_URL);
    return null;
  }

  const content = isUserLoading ? (
    <VaLoadingIndicator message="Loading user information..." />
  ) : (
    children
  );

  setTimeout(() => {
    if (document.querySelector('.va-button-link.schemaform-sip-save-link')) {
      document
        .querySelector('.va-button-link.schemaform-sip-save-link')
        .setAttribute('style', 'display:none');
    }
  }, '1000');
  return (
    <AccessTokenManager userLoggedIn={userLoggedIn}>
      <div className="container">
        <Header />
        <div className="form_container form-686c row">{content}</div>
        <Footer />
      </div>
    </AccessTokenManager>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
