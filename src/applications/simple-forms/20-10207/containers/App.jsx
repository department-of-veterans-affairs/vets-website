import React from 'react';

import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { fetchInProgressForm } from '~/platform/forms/save-in-progress/actions';
import formConfig from '../config/form';
import { WIP } from '../../shared/components/WIP';
import { workInProgressContent } from '../config/constants';

const transformer = (pages, formData, metadata) => {
  const { veteranSsnLastFour = '', veteranVaFileNumberLastFour = '' } =
    formData?.nonPrefill || {};

  return {
    pages,
    formData: {
      veteran: {
        ssnLastFour: veteranSsnLastFour,
        vaFileLastFour: veteranVaFileNumberLastFour,
      },
    },
    metadata,
  };
};

function App({ location, children, showForm, isLoading }) {
  const userProfile = useSelector(state => state.user.profile);
  const savedForm = userProfile?.savedForms?.find(f => f.form === '21-4138');
  // const savedForm = userProfile?.savedForms?.find(f => f.form === '20-10207');

  if (savedForm) {
    fetchInProgressForm('21-4138', [], true, transformer);
  }

  if (isLoading) {
    return (
      <va-loading-indicator
        message="Please wait while we load the application for you."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }
  if (!showForm) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  fetchInProgressForm: PropTypes.func,
  isLoading: PropTypes.bool,
  showForm: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoading: state?.featureToggles?.loading,
  showForm: toggleValues(state)[FEATURE_FLAG_NAMES.form2010207] || false,
});

const mapDispatchToProps = {
  fetchInProgressForm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
