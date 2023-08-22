import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';

import { fetchTotalDisabilityRating } from '../utils/actions/disability-rating';
import content from '../locales/en/content.json';
import formConfig from '../config/form';

const App = props => {
  const {
    children,
    features,
    formData,
    getTotalDisabilityRating,
    location,
    setFormData,
    totalDisabilityRating,
    user,
  } = props;
  const { veteranFullName } = formData;
  const { loading, isSigiEnabled } = features;
  const { dob: veteranDateOfBirth } = user;

  /**
   * Fetch total disability rating & set default view fields in the form data
   *
   * NOTE: veteranFullName is included in the dependency list to reset view fields when
   * starting a new application from save-in-progress.
   *
   * NOTE (2): the Date of Birth value from the user's profile is included to fix a bug
   * where some profiles do not contain a DOB value. In this case, we need to ask the
   * user for that data for proper submission.
   */
  useEffect(
    () => {
      if (!loading) {
        const defaultViewFields = {
          'view:userDob': veteranDateOfBirth,
          'view:isSigiEnabled': isSigiEnabled,
          'view:totalDisabilityRating':
            parseInt(totalDisabilityRating, 10) || 0,
        };

        getTotalDisabilityRating();
        setFormData({
          ...formData,
          ...defaultViewFields,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isSigiEnabled,
      loading,
      totalDisabilityRating,
      veteranFullName,
      veteranDateOfBirth,
    ],
  );

  return loading ? (
    <va-loading-indicator message={content['load-app']} set-focus />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  features: PropTypes.object,
  formData: PropTypes.object,
  getTotalDisabilityRating: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  totalDisabilityRating: PropTypes.number,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  features: {
    loading: state.featureToggles.loading,
    isSigiEnabled: state.featureToggles.hcaSigiEnabled,
  },
  formData: state.form.data,
  totalDisabilityRating: state.disabilityRating.totalDisabilityRating,
  user: state.user.profile,
});

const mapDispatchToProps = {
  setFormData: setData,
  getTotalDisabilityRating: fetchTotalDisabilityRating,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
