import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { isLoggedIn } from 'platform/user/selectors';
import Footer from '~/platform/site-wide/representative/components/footer/Footer';
import Header from '~/platform/site-wide/representative/components/header/Header';
import { addStyleToShadowDomOnPages, getFormNumber } from '../helpers/index';
import { SIGN_IN_URL } from '../constants';
import { fetchUser } from '../actions/user';
import { selectIsUserLoading, selectUserProfile } from '../selectors/user';
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
  const profile = useSelector(selectUserProfile);
  const formNumber = getFormNumber();
  useEffect(() => {
    document.title = `Submit VA Form ${formNumber} | Accredited Representative Portal | Veterans Affairs`;
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      [''],
      [
        'va-memorable-date',
        'va-accordion-item',
        'va-file-input',
        'va-file-input-multiple',
        'va-checkbox-group',
        'va-radio',
        'va-text-input[name="root_veteranFullName_first"]',
        'va-text-input[name="root_claimantFullName_first"]',
      ],
      '.usa-label{margin-top: 16px} #dateHint {display: none} .usa-form-group--month-select {width: 159px} .usa-accordion, .usa-accordion-bordered, .usa-accordion--bordered {margin: 24px 0 !important;} .usa-accordion__content.usa-prose {border:1px solid #f0f0f0;} .usa-hint {white-space: pre-line; margin-bottom: 16px} .label-header {display:none} .input-wrap .usa-fieldset .usa-legend h3 {display:block}',
    );
  });

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchUser()), [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = e => {
      const event = e || window.event;
      const isIncomplete =
        sessionStorage.getItem('formIncompleteARP') === 'true';
      if (isIncomplete) {
        event.preventDefault();
        event.returnValue = ''; // Required for most browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
        <Header profile={profile} />
        <div className={`form_container row form-${formNumber}`}>{content}</div>
        <Footer />
      </div>
    </AccessTokenManager>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
