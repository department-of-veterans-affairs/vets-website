import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchPersonalInformation, fetchEligibility } from '../actions';
import { fetchUser } from '../selectors/userDispatch';
import { personalInfoFetchProgress } from '../selectors/personalInfoFetchInProgress';
import { prefillTransformer } from '../helpers';

export const App = ({
  location,
  children,
  formData,
  setFormData,
  getPersonalInfo,
  claimantInfo,
  firstName,
  getEligibility,
  eligibility,
  user,
  personalInfoFetchInProgress,
}) => {
  useEffect(
    () => {
      if (user.login.currentlyLoggedIn && !personalInfoFetchInProgress) {
        if (!firstName) {
          getPersonalInfo();
        } else if (!formData?.claimantId && claimantInfo.claimantId) {
          setFormData({
            ...formData,
            ...claimantInfo,
          });
        }
        // the firstName check ensures that eligibility only gets called after we have obtained claimant info
        // we need this to avoid a race condition when a user is being loaded freshly from VADIR on DGIB
        if (!eligibility && firstName) {
          getEligibility();
        } else if (!formData.eligibility) {
          setFormData({
            ...formData,
            eligibility,
          });
        }
      }
    },
    [
      formData,
      setFormData,
      firstName,
      claimantInfo,
      getPersonalInfo,
      getEligibility,
      eligibility,
      user,
      personalInfoFetchInProgress,
    ],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/education/apply-for-benefits-form-22-1990">
          Apply for education benefits
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.attributes?.claimant?.firstName;
  const transformedClaimantInfo = prefillTransformer(null, null, null, state);
  const claimantInfo = transformedClaimantInfo.formData;
  const eligibility = state.data?.eligibility;
  const user = fetchUser(state);
  const personalInfoFetchInProgress = personalInfoFetchProgress(state);
  return {
    formData,
    firstName,
    claimantInfo,
    eligibility,
    user,
    personalInfoFetchInProgress,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getEligibility: fetchEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

App.propTypes = {
  children: PropTypes.object,
  eligibility: PropTypes.object,
  firstName: PropTypes.string,
  formData: PropTypes.object,
  getEligibility: PropTypes.func,
  getPersonalInfo: PropTypes.func,
  location: PropTypes.string,
  personalInfoFetchInProgress: PropTypes.bool,
  setFormData: PropTypes.func,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
  }),
};
