import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { isLoggedIn } from 'platform/user/selectors';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';
import manifest from '../manifest.json';
import { TITLE } from '../constants';
import {
  fetchDirectDeposit,
  fetchDuplicateContactInfo,
  fetchPersonalInformation,
} from '../actions';
import prefillTransformer from '../config/prefill-transformer';

function App({
  location,
  children,
  userLoggedIn,
  getPersonalInformation,
  setFormData,
  formData,
  claimantInfo,
  user,
  getDirectDeposit,
  getDuplicateContactInfo,
  duplicateEmail,
  duplicatePhone,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

  useEffect(() => {
    document.title = `${TITLE} | Veterans Affairs`;
  });

  useEffect(
    () => {
      if (!userLoggedIn && location.pathname !== '/introduction') {
        window.location.href = manifest.rootUrl;
      }
    },
    [userLoggedIn, location],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }
    },
    [fetchedUserInfo, getPersonalInformation, user?.login?.currentlyLoggedIn],
  );

  // Merge claimant info into form data when it becomes available
  // This ensures prefill data is applied even on fresh form starts
  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      // Only merge if claimantId is missing in formData but available in claimantInfo
      if (!formData?.claimantId && claimantInfo?.claimantId) {
        setFormData({
          ...formData,
          ...claimantInfo,
        });
      }
    },
    [claimantInfo, formData, setFormData, user?.login?.currentlyLoggedIn],
  );

  useEffect(
    () => {
      if (user?.login?.currentlyLoggedIn && !fetchedDirectDeposit) {
        setFetchedDirectDeposit(true);
        getDirectDeposit();
      }
    },
    [fetchedDirectDeposit, getDirectDeposit, user?.login?.currentlyLoggedIn],
  );

  useEffect(
    () => {
      if (
        formData?.contactInfo?.mobilePhone &&
        formData?.contactInfo?.emailAddress &&
        !formData?.duplicateEmail &&
        !formData?.duplicatePhone
      ) {
        getDuplicateContactInfo(
          [{ value: formData?.contactInfo?.emailAddress, dupe: '' }],
          [
            {
              value: formData?.contactInfo?.mobilePhone?.contact,
              dupe: '',
            },
          ],
        );
      }

      if (
        duplicateEmail?.length > 0 &&
        duplicateEmail !== formData?.duplicateEmail
      ) {
        setFormData({
          ...formData,
          duplicateEmail,
        });
      }

      if (
        duplicatePhone?.length > 0 &&
        duplicatePhone !== formData?.duplicatePhone
      ) {
        setFormData({
          ...formData,
          duplicatePhone,
        });
      }
    },
    [
      getDuplicateContactInfo,
      duplicateEmail,
      duplicatePhone,
      formData,
      setFormData,
    ],
  );

  return (
    <div className="form-22-10297-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  claimantInfo: PropTypes.object,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  formData: PropTypes.object,
  getDirectDeposit: PropTypes.func,
  getDuplicateContactInfo: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  user: PropTypes.object,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => {
  // Transform claimant info using prefillTransformer to get form-ready data
  const transformedClaimantInfo = prefillTransformer(null, {}, null, state);
  const claimantInfo = transformedClaimantInfo?.formData || {};

  return {
    userLoggedIn: isLoggedIn(state),
    user: state.user,
    formData: state.form?.data || {},
    claimantInfo,
    duplicateEmail: state.data?.duplicateEmail,
    duplicatePhone: state.data?.duplicatePhone,
  };
};

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
