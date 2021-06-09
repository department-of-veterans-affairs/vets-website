import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { isLoggedIn } from 'platform/user/selectors';
import FormFooter from 'platform/forms/components/FormFooter';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import { getFormPagePaths } from '../utils';
import { generateCoe } from '../actions';
import { COE_FORM_NUMBER, CALLSTATUS } from '../constants';

import { CertificateDownload } from '../components/CertificateDownload';

const FORM_PATHS = getFormPagePaths(formConfig);

function App(props) {
  const {
    location,
    children,
    loggedIn,
    router,
    certificateOfEligibility: { generateAutoCoeStatus },
    hasSavedForm,
  } = props;
  const formPath = window.location.pathname.split('/').pop();
  if (!loggedIn && FORM_PATHS.includes(formPath)) {
    router.push('/introduction');
  }
  // if a user is logged in and doesn't have a saved form, fire off the api call
  useEffect(
    () => {
      if (!hasSavedForm) {
        props.generateCoe();
      }
    },
    [hasSavedForm],
  );

  let content;

  if (generateAutoCoeStatus === CALLSTATUS.idle) {
    content = <LoadingIndicator message="Loading application..." />;
  } else if (generateAutoCoeStatus === CALLSTATUS.pending) {
    content = (
      <LoadingIndicator message="Checking automatic COE eligibility..." />
    );
  } else if (generateAutoCoeStatus === CALLSTATUS.success) {
    content = <CertificateDownload />;
  } else {
    content = (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    );
  }
  return (
    <>
      <header className="row">
        <FormTitle title="Apply for a VA home loan Certificate of Eligibility" />
        <p>Request for a Certificate of Eligibility (VA Form 26-1880)</p>
      </header>
      {content}
      <FormFooter formConfig={formConfig} />
    </>
  );
}

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  certificateOfEligibility: state.certificateOfEligibility,
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === COE_FORM_NUMBER,
  ),
});

const mapDispatchToProps = {
  generateCoe,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
