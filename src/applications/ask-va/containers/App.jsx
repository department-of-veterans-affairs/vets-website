import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import cookie from 'js-cookie';
// import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// import PropTypes from 'prop-types';
import React from 'react';
// import BreadCrumbs from '../components/BreadCrumbs';
// import ProgressBar from '../components/ProgressBar';
// import formConfig from '../config/form';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// export default function App({ location, children }) {
export default function App() {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  // manually set cookie to true to force new VA.gov experience
  const isCanaryEnabledViaCookie =
    cookie.get('askVaCanaryReleaseOverride') === 'true';

  const toggleName = TOGGLE_NAMES.askVaCanaryRelease;
  const isCanaryEnabled = useToggleValue(toggleName);
  const isLoadingFeatureFlags = useToggleLoadingValue(toggleName);
  const performRedirect =
    !isLoadingFeatureFlags && !(isCanaryEnabled || isCanaryEnabledViaCookie);

  if (performRedirect) {
    window.location.href = 'https://ask.va.gov/';
    return <></>;
  }

  return (
    <>
      <VaAlert
        className="usa-width-two-thirds vads-u-margin-left--2 vads-u-margin-top--3  vads-u-margin-bottom--9"
        close-btn-aria-label="Close notification"
        status="warning"
        uswds
      >
        <h2 id="track-your-status-on-mobile" slot="headline">
          This version of Ask VA isn't working right now
        </h2>
        <p className="vads-u-margin-y--0">
          We're making some updates to Ask VA on VA.gov. We're sorry it's not
          working right now. You can still use the{' '}
          <a href="https://ask.va.gov/">previous version of Ask VA</a>
        </p>
      </VaAlert>
      {/* <BreadCrumbs currentLocation={location.pathname} /> */}
      {/* <RoutedSavableApp formConfig={formConfig} currentLocation={location}> */}
      {/* <ProgressBar pathname={location.pathname} /> */}
      {/* {children} */}
      {/* </RoutedSavableApp> */}
    </>
  );
}

// App.propTypes = {
//   children: PropTypes.node,
//   location: PropTypes.object,
// };
