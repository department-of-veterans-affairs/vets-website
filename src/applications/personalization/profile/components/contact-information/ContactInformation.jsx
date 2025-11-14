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
import { focusElement, waitForRenderThenFocus } from '~/platform/utilities/ui';

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
      // Origininal:
      // Set the focus on the page's focus target _unless_ one of the following is true:
      // - there is a hash in the URL and there is a named-anchor that matches
      //   the hash
      // - the user just came to this route via the root profile route. If a
      //   user got to the Profile via a link to /profile or /profile/ we want
      //   to focus on the "Profile" sub-nav H1, not the H2 on this page, for
      //   a11y reasonse
      // New: refactored to improve reliability of focus and scroll behavior for hash-based navigation
      // and dynamic content loading.

      const cameFromProfileRoot = !!lastLocation?.pathname.match(
        new RegExp(`${PROFILE_PATHS.PROFILE_ROOT}/?$`),
      );

      const { hash } = window.location;

      // Track all pending async operations for cleanup
      let rafId1;
      let rafId2;
      let scrollTimeoutId;
      let focusTimeoutId;
      let retryTimeoutId;
      let cancelled = false;

      // cleanup function to cancel pending operations
      const cleanup = () => {
        cancelled = true;
        if (rafId1) cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
        if (focusTimeoutId) clearTimeout(focusTimeoutId);
        if (retryTimeoutId) clearTimeout(retryTimeoutId);
      };

      const selector = hash;
      const scrollTarget =
        getScrollTarget(hash) || document.querySelector(selector);

      // early return if for profile referrer
      if (cameFromProfileRoot) return cleanup;

      // early return if no hash > focus on default focus target
      if (!hash) {
        focusElement('[data-focus-target]');
        return cleanup;
      }

      // both focus and scroll to element
      const focusAndScroll = el => {
        if (!el || cancelled) return;

        // Wait for layout to stabilize with multiple frames
        rafId1 = requestAnimationFrame(() => {
          if (cancelled) return;
          rafId2 = requestAnimationFrame(() => {
            if (cancelled) return;
            scrollTimeoutId = setTimeout(() => {
              if (cancelled) return;
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });

              // Focus after scroll
              if (
                el.tagName.toLowerCase().startsWith('va-button') &&
                el.shadowRoot
              ) {
                waitForRenderThenFocus(selector, document, 50, 'button');
              } else {
                focusTimeoutId = setTimeout(() => {
                  if (!cancelled) {
                    if (!el.hasAttribute('tabindex')) {
                      el.setAttribute('tabindex', '-1');
                    }
                    focusElement(el);
                  }
                }, 350);
              }
            }, 200);
          });
        });
      };

      // if hash already present, focus and scroll right away
      const existing = document.querySelector(selector);
      if (existing) {
        focusAndScroll(scrollTarget || existing);
        return cleanup;
      }

      // retry loop with timeout to wait for element to appear
      let attempts = 0;
      const maxAttempts = 10;
      const intervalMs = 150;

      const retry = () => {
        if (cancelled) return;
        const el = document.querySelector(selector);
        if (el) {
          focusAndScroll(scrollTarget || el);
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          retryTimeoutId = setTimeout(retry, intervalMs);
        }
      };
      retry();

      return cleanup;
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
        appTitle="contact information page"
        dependencies={[externalServices.VAPRO_CONTACT_INFO]}
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
