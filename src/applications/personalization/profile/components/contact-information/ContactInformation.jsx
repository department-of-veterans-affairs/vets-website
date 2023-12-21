import React, { useEffect, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@@vap-svc/actions';

import { hasBadAddress } from '@@vap-svc/selectors';
import { clearMostRecentlySavedField } from '@@vap-svc/actions/transactions';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { hasVAPServiceConnectionError } from '~/platform/user/selectors';
import { focusElement } from '~/platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import Headline from '../ProfileSectionHeadline';

import ContactInformationContent from './ContactInformationContent';

import { PROFILE_PATHS } from '../../constants';

// drops the leading `edit` from the hash and looks for that element
const getScrollTarget = hash => {
  const hashWithoutLeadingEdit = hash.replace(/^#edit-/, '#');
  return document.querySelector(hashWithoutLeadingEdit);
};

const ContactInformation = () => {
  const lastLocation = useLastLocation();

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );
  const hasVAPServiceError = useSelector(state =>
    hasVAPServiceConnectionError(state),
  );

  const userHasBadAddress = useSelector(hasBadAddress);

  const addressValidationModalIsShowing = useSelector(
    state => state?.vapService?.modal === 'addressValidation',
  );

  const addressSavedDidError = useSelector(
    state => state.vapService.addressValidation.addressValidationError,
  );

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );

  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(
    () => {
      document.title = `Contact Information | Veterans Affairs`;

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
        window.onbeforeunload = () => '';
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

  const showFormBadAddressAlert =
    userHasBadAddress &&
    !addressSavedDidError &&
    !addressValidationModalIsShowing;

  return (
    <>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedEdits}
      />
      <Headline>Contact information</Headline>
      <DowntimeNotification
        render={handleDowntimeForSection('personal and contact')}
        dependencies={[externalServices.mvi, externalServices.vaProfile]}
      >
        <ContactInformationContent
          hasVAPServiceError={hasVAPServiceError}
          showBadAddress={showFormBadAddressAlert}
        />
      </DowntimeNotification>
    </>
  );
};

ContactInformation.propTypes = {};

export default ContactInformation;
