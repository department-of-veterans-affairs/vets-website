import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

const PensionEntry = ({
  children,
  formData,
  location,
  loggedIn,
  setFormData,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading,
  );
  const redirectToHowToPage =
    pensionFormEnabled === false &&
    !location.pathname?.includes('/introduction');

  useEffect(
    () => {
      setFormData({
        ...formData,
        isLoggedIn: loggedIn,
      });
    },
    // Disabling because we don't want this to run when `formData` changes.
    // The functions used in this `useEffect` (e.g. `setFormData`) never change,
    // so we don't need to include them in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );

  if (redirectToHowToPage === true) {
    window.location.href = '/pension/survivors-pension/';
  }

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!pensionFormEnabled) {
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

PensionEntry.propTypes = {
  children: PropTypes.object,
  formData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PensionEntry);
