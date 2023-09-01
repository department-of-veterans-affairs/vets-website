import React from 'react';
// import { Switch, Route, Link, useHistory, useLocation } from 'react-router-dom';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage'; // Make sure the path to NoFormPage is correct

export default function BurialsEntry({ location, children }) {
  const showForm = false;
  return showForm ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ) : (
    <NoFormPage />
  );
}

// import React from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// import { useFeatureToggle } from 'platform/utilities/feature-toggles';
// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
// import formConfig from './config/form';
// import { NoFormPage } from './components/NoFormPage';

// function BurialsEntry({ location, children, isLoadingFeatures }) {
//   const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
//   const burialFormEnabled = useToggleValue(TOGGLE_NAMES.burialFormEnabled);
//   const redirectToHowToPage =
//     burialFormEnabled === false && location.pathname !== '/introduction';
//   if (redirectToHowToPage === true) {
//     window.location.href = '/whatever/the/how-to/page/is';
//   }

//   if (isLoadingFeatures !== false || redirectToHowToPage) {
//     return <va-loading-indicator message="Loading application..." />;
//   }

//   if (!burialFormEnabled) {
//     // this is where you will return your no form page component instead of this div
//     return <NoFormPage />;
//   }
//   return (
//     <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
//       {children}
//     </RoutedSavableApp>
//   );
// }

// const mapStateToProps = state => ({
//   isLoadingFeatures: toggleValues(state).loading,
// });
// BurialsEntry.propTypes = {
//   children: PropTypes.node.isRequired,
//   location: PropTypes.object.isRequired,
//   isLoadingFeatures: PropTypes.bool,
// };

// const mapDispatchToProps = {};

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// );
