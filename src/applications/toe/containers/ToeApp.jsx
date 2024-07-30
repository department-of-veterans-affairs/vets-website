import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { fetchPersonalInformation, fetchDirectDeposit } from '../actions';
import { mapFormSponsors } from '../helpers';
import { SPONSORS_TYPE } from '../constants';
import { getAppData } from '../selectors';

function ToeApp({
  children,
  formData,
  getDirectDeposit,
  getPersonalInformation,
  isLOA3,
  isLoggedIn,
  location,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
  showMeb1990ER6MaintenanceMessage,
  showMebEnhancements,
  showMebEnhancements06,
  showMebEnhancements08,
  toeLightHouseDgiDirectDeposit,
}) {
  const [fetchedUserInfo, setFetchedUserInfo] = useState(false);
  const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);
  const [lightHouseFlag, setLighthouseFlag] = useState(false);

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedUserInfo) {
        setFetchedUserInfo(true);
        getPersonalInformation();
      }

      if (
        !sponsors?.loadedFromSavedState &&
        isArray(sponsorsSavedState?.sponsors)
      ) {
        setFormData(mapFormSponsors(formData, sponsorsSavedState));
      } else if (sponsorsInitial && !sponsors) {
        setFormData(mapFormSponsors(formData, sponsorsInitial));
      }
    },
    [
      fetchedUserInfo,
      formData,
      getPersonalInformation,
      user?.login?.currentlyLoggedIn,
      setFormData,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
    ],
  );

  useEffect(
    () => {
      if (isLOA3 !== formData.isLOA3) {
        setFormData({
          ...formData,
          isLOA3, // ES6 Syntax
        });
      }
    },
    [formData, setFormData, isLOA3],
  );

  useEffect(
    () => {
      if (showMebEnhancements !== formData.showMebEnhancements) {
        setFormData({
          ...formData,
          showMebEnhancements,
        });
      }
    },
    [formData, setFormData, showMebEnhancements],
  );

  useEffect(
    () => {
      if (showMebEnhancements06 !== formData.showMebEnhancements06) {
        setFormData({
          ...formData,
          showMebEnhancements06,
        });
      }
    },
    [formData, setFormData, showMebEnhancements06],
  );

  useEffect(
    () => {
      if (
        showMeb1990ER6MaintenanceMessage !==
        formData.showMeb1990ER6MaintenanceMessage
      ) {
        setFormData({
          ...formData,
          showMeb1990ER6MaintenanceMessage,
        });
      }
    },
    [formData, setFormData, showMeb1990ER6MaintenanceMessage],
  );

  useEffect(
    () => {
      if (showMebEnhancements08 !== formData.showMebEnhancements08) {
        setFormData({
          ...formData,
          showMebEnhancements08,
        });
      }
      if (
        toeLightHouseDgiDirectDeposit !==
        formData?.toeLightHouseDgiDirectDeposit
      ) {
        setLighthouseFlag(true);

        setFormData({
          ...formData,
          toeLightHouseDgiDirectDeposit,
        });
      }
    },
    [
      formData,
      setFormData,
      showMebEnhancements08,
      toeLightHouseDgiDirectDeposit,
    ],
  );

  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }

      if (!fetchedDirectDeposit && lightHouseFlag && isLoggedIn && isLOA3) {
        setFetchedDirectDeposit(true);
        getDirectDeposit(formData?.toeLightHouseDgiDirectDeposit);
      }
    },
    [
      isLoggedIn,
      isLOA3,
      fetchedDirectDeposit,
      getDirectDeposit,
      user?.login?.currentlyLoggedIn,
      lightHouseFlag,
    ],
  );

  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
            wrapping
            breadcrumbList={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/education',
                label: 'Education and training',
              },
              {
                href:
                  '/education/survivor-dependent-benefits/transferred-benefits/',
                label: 'VA education benefits for survivors and dependents',
              },
              {
                href:
                  '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e',
                label: 'Apply to use transferred education benefits',
              },
            ]}
          />
        </div>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}

ToeApp.propTypes = {
  children: PropTypes.object,
  formData: PropTypes.object,
  getDirectDeposit: PropTypes.func,
  getPersonalInformation: PropTypes.func,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showMebEnhancements: PropTypes.bool,
  showMebEnhancements06: PropTypes.bool,
  showUpdatedFryDeaApp: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
  sponsorsInitial: SPONSORS_TYPE,
  sponsorsSavedState: SPONSORS_TYPE,
  toeLightHouseDgiDirectDeposit: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getAppData(state),
  formData: state.form?.data || {},
  claimant: state.data?.formData?.data?.attributes?.claimant,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  sponsors: state.form?.data?.sponsors,
  sponsorsInitial: state?.data?.sponsors,
  sponsorsSavedState: state.form?.loadedData?.formData?.sponsors,
  user: state.user,
});

const mapDispatchToProps = {
  getDirectDeposit: fetchDirectDeposit,
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToeApp);
