import React from 'react';
import { connect } from 'react-redux';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

const renderNewLandingContent = () => {
  return (
    <>
      <p>Use our online tool to fill out your form.</p>

      <va-link-action
        href="/get-help-from-accredited-representative/appoint-rep"
        text="Fill out your form online"
        type="secondary"
      />

      <p>
        If you don’t want to use our online tool to fill out your form, you can
        fill out one of the PDF forms listed here. The form you’ll need to fill
        out depends on the type of accredited representative you’re appointing.
      </p>
    </>
  );
};

const renderOldLandingContent = () => {
  return (
    <>
      <p>
        Fill out one of the PDF forms listed here. The form you’ll need to fill
        out depends on the type of accredited representative you’re appointing.
      </p>
    </>
  );
};

export const App = ({ show }) => {
  const { useToggleLoadingValue } = useFeatureToggle();

  const togglesLoading = useToggleLoadingValue();

  if (togglesLoading) {
    return null;
  }

  return (
    <>
      {show && renderNewLandingContent()}
      {!show && renderOldLandingContent()}
    </>
  );
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.appointARepresentativeEnableFrontend,
});

export default connect(mapStateToProps, null)(App);
