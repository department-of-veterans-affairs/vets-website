import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import Footer from '../components/common/Footer/Footer';
import Header from '../components/common/Header/Header';
import { SIGN_IN_URL, isProduction } from '../constants';
import { fetchUser } from '../actions/user';
import { selectIsUserLoading } from '../selectors/user';
import { selectShouldGoToSignIn } from '../selectors/navigation';
import { removeDefaultHeaders } from '../utilities/helpers';

import { wrapWithBreadcrumb } from '../components/common/Breadcrumbs/Breadcrumbs';

const App = ({ children }) => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  const isAppEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );
  const isForm21Enabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalForm21a,
  );
  const shouldExitApp = isProduction && !isAppEnabled;
  const isAppToggleLoading = useToggleLoadingValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );
  const shouldGoToSignIn = useSelector(selectShouldGoToSignIn);
  const isUserLoading = useSelector(selectIsUserLoading);

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchUser()), [dispatch]);

  useEffect(() => removeDefaultHeaders(), []);

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

  if (!isForm21Enabled) {
    window.location.replace('/representative');
    return null;
  }

  if (shouldGoToSignIn) {
    window.location.assign(SIGN_IN_URL);
    return null;
  }

  const content = isUserLoading ? (
    <VaLoadingIndicator message="Loading user information..." />
  ) : (
    <div data-testid="form21a-content">{children}</div>
  );

  return (
    <div className="container">
      <Header />
      {wrapWithBreadcrumb(content)}
      <Footer />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
