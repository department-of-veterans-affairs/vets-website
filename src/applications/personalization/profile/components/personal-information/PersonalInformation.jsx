import React, { useEffect, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { useSelector, useDispatch } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { openModal, clearMostRecentlySavedField } from '@@vap-svc/actions';
import { personalInformationLoadError } from '@@profile/selectors';

import { hasBadAddress } from '@@vap-svc/selectors';

import { PROFILE_PATHS } from '@@profile/constants';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { focusElement } from '~/platform/utilities/ui';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { useSessionStorage } from '~/applications/personalization/common/hooks/useSessionStorage';

import Headline from '../ProfileSectionHeadline';
import PersonalInformationContent from './PersonalInformationContent';
import BadAddressAlert from '../alerts/bad-address/ProfileAlert';
import { handleDowntimeForSection } from '../alerts/DowntimeBanner';

// drops the leading `edit` from the hash and looks for that element
const getScrollTarget = hash => {
  const hashWithoutLeadingEdit = hash.replace(/^#edit-/, '#');
  return document.querySelector(hashWithoutLeadingEdit);
};
/**
 *
 *
 * @return {*}
 */
const PersonalInformation = () => {
  const lastLocation = useLastLocation();

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );

  const hasPersonalInformationServiceError = !!useSelector(
    personalInformationLoadError,
  );

  const userHasBadAddress = useSelector(hasBadAddress);

  // feature toggles for downtime till 11/19/2023
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const authExpVbaDowntimeMessage = useToggleValue(
    TOGGLE_NAMES.authExpVbaDowntimeMessage,
  );

  // use session storage to track if downtime alert has been dismissed
  const [dismissed, setDismissed] = useSessionStorage(
    'authExpVbaDowntimeMessageDismissed',
  );
  const handleDismiss = () => {
    setDismissed('true');
  };

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );

  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(
    () => {
      document.title = `Personal Information | Veterans Affairs`;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert],
  );

  useEffect(
    () => {
      // Set the focus on the page's focus target _unless_ one of the following
      // is true:
      // - there is a hash in the URL and there is a named-anchor that matches
      //   the hash
      // - the user just came to this route via the root profile route. If a
      //   user got to the Profile via a link to /profile or /profile/ we want
      //   to focus on the "Profile" sub-nav H1, not the H2 on this page, for
      //   a11y reasons
      const pathRegExp = new RegExp(`${PROFILE_PATHS.PROFILE_ROOT}/?$`);
      if (lastLocation?.pathname.match(new RegExp(pathRegExp))) {
        return;
      }
      if (window.location.hash) {
        // We will always attempt to focus on the element that matches the
        // location.hash
        const focusTarget = document.querySelector(window.location.hash);
        // But if the hash starts with `edit` we will scroll a different
        // element to the top of the viewport
        const scrollTarget = getScrollTarget(window.location.hash);
        if (scrollTarget) {
          scrollTarget.scrollIntoView();
        }
        if (focusTarget) {
          focusElement(focusTarget);
          return;
        }
      }

      focusElement('[data-focus-target]');
    },
    [lastLocation],
  );

  useEffect(
    () => {
      // Show alert when navigating away
      if (hasUnsavedEdits) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [hasUnsavedEdits],
  );

  useEffect(
    () => {
      return () => {
        openEditModal(null);
      };
    },
    [openEditModal],
  );

  return (
    <>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedEdits}
      />
      {userHasBadAddress &&
        !authExpVbaDowntimeMessage && (
          <>
            <BadAddressAlert />
          </>
        )}

      <Headline>Personal information</Headline>

      <DowntimeNotification
        render={handleDowntimeForSection('personal and contact')}
        dependencies={[externalServices.mvi, externalServices.vaProfile]}
      >
        {authExpVbaDowntimeMessage && (
          <VaAlert
            status="warning"
            closeable
            closeBtnAriaLabel="Close notification"
            class="vads-u-margin-bottom--1"
            onCloseEvent={handleDismiss}
            visible={dismissed !== 'true'}
            uswds
          >
            <h2 slot="headline">We’re updating our systems right now</h2>
            <p>
              We’re updating our systems to add the 2024 cost-of-living increase
              for VA benefits. If you have trouble using this tool, check back
              after <strong>Sunday, November 19, 2023</strong>, at{' '}
              <strong>7:00 p.m. ET</strong>.
            </p>
          </VaAlert>
        )}
        <PersonalInformationContent
          hasPersonalInformationServiceError={
            hasPersonalInformationServiceError
          }
        />
      </DowntimeNotification>
    </>
  );
};

PersonalInformation.propTypes = {};

export default PersonalInformation;
