import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { fetchUser } from '../actions/user';
import { selectUserIsLoading } from '../selectors/user';
import Footer from '../components/common/Footer/Footer';
import Header from '../components/common/Header/Header';
import Form21a from '../accreditation/21a/containers/Form';

const App = ({ location, children }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserIsLoading);

  useEffect(
    () => {
      dispatch(fetchUser());
    },
    [dispatch],
  );

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isAppToggleLoading = useToggleLoadingValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );

  const isAppEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );

  const isProduction = window.Cypress || environment.isProduction();

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (isProduction && !isAppEnabled) {
    document.location.replace('/');
    return null;
  }

  return (
    <>
      <Header />
      {isLoading ? (
        <VaLoadingIndicator message="Loading user information..." />
      ) : (
        <Form21a location={location}>{children}</Form21a>
      )}
      <Footer />
    </>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
