import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import Footer from '../../../accreditation/21a/components/common/Footer/Footer';
import Header from '../../../accreditation/21a/components/common/Header/Header';
import { SIGN_IN_URL } from '../../../accreditation/21a/constants';
import { fetchUser } from '../../../accreditation/21a/actions/user';
import { selectIsUserLoading } from '../../../accreditation/21a/selectors/user';
import { selectShouldGoToSignIn } from '../../../accreditation/21a/selectors/navigation';

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

  return (
    <div className="container">
      <Header />
      {content}
      <Footer />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
