import React, { useEffect, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '@@vap-svc/actions';

import {
  showProfileLGBTQEnhancements,
  showBadAddressIndicator,
  hasBadAddress,
  forceBadAddressIndicator,
} from '@@profile/selectors';
import { clearMostRecentlySavedField } from '@@vap-svc/actions/transactions';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { hasVAPServiceConnectionError } from '~/platform/user/selectors';
import { focusElement } from '~/platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import Headline from '../ProfileSectionHeadline';

import PersonalInformationContent from './PersonalInformationContent';

import { PROFILE_PATHS } from '../../constants';

import BadAddressAlert from '../alerts/bad-address/ProfileAlert';

// drops the leading `edit` from the hash and looks for that element
const getScrollTarget = hash => {
  const hashWithoutLeadingEdit = hash.replace(/^#edit-/, '#');
  return document.querySelector(hashWithoutLeadingEdit);
};

const PersonalInformation = () => {
  const lastLocation = useLastLocation();

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );
  const hasVAPServiceError = useSelector(hasVAPServiceConnectionError);
  const shouldShowProfileLGBTQEnhancements = useSelector(
    showProfileLGBTQEnhancements,
  );

  const userHasBadAddress = useSelector(hasBadAddress);

  const shouldForceBadAddressIndicator = useSelector(
    state =>
      forceBadAddressIndicator(state) &&
      !sessionStorage.getItem('profile-has-cleared-bad-address-indicator'),
  );

  const badAddressIndicatorEnabled = useSelector(showBadAddressIndicator);

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );

  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(
    () => {
      if (shouldShowProfileLGBTQEnhancements)
        document.title = `Personal Information | Veterans Affairs`;
      else
        document.title = `Personal And Contact Information | Veterans Affairs`;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert, shouldShowProfileLGBTQEnhancements],
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

  const showHeroBadAddressAlert =
    badAddressIndicatorEnabled &&
    (userHasBadAddress || shouldForceBadAddressIndicator);

  return (
    <>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedEdits}
      />
      {showHeroBadAddressAlert && (
        <>
          <BadAddressAlert />
        </>
      )}
      {shouldShowProfileLGBTQEnhancements ? (
        <Headline>Personal information</Headline>
      ) : (
        <Headline>Personal and contact information</Headline>
      )}
      <DowntimeNotification
        render={handleDowntimeForSection('personal and contact')}
        dependencies={[externalServices.mvi, externalServices.vaProfile]}
      >
        <PersonalInformationContent
          hasVAPServiceError={hasVAPServiceError}
          shouldShowProfileLGBTQEnhancements={
            shouldShowProfileLGBTQEnhancements
          }
        />
      </DowntimeNotification>
    </>
  );
};

PersonalInformation.propTypes = {};

export default PersonalInformation;
