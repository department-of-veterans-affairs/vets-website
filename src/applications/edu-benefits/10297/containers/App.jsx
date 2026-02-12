import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { isLoggedIn } from 'platform/user/selectors';
import formConfig from '../config/form';
import { addStyleToShadowDomOnPages } from '../../utils/helpers';
import NeedHelp from '../components/NeedHelp';
import Breadcrumbs from '../components/Breadcrumbs';
import manifest from '../manifest.json';
import { TITLE } from '../constants';
import { fetchPersonalInformation } from '../actions';
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
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);

  useEffect(() => {
    // Insert CSS to hide 'For example: January 19 2000' hint on memorable dates
    // (can't be overridden by passing 'hint' to uiOptions):
    addStyleToShadowDomOnPages(
      ['date-released-from-active-duty', 'training-provider-start-date'],
      ['va-memorable-date'],
      '#dateHint {display: none}',
    );
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

  return (
    <div className="form-22-10297-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  claimantInfo: PropTypes.object,
  formData: PropTypes.object,
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
  };
};

const mapDispatchToProps = {
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
