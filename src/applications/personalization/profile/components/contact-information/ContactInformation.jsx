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
import { getEditButtonFromHash, getScrollTarget } from '../../util/hashUtils';

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

  // Optional chaining prevents runtime errors in tests where addressValidation may be undefined
  const addressSavedDidError = useSelector(
    state => state.vapService.addressValidation?.addressValidationError,
  );

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );

  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(() => {
    document.title = `Contact Information | Veterans Affairs`;

    return () => {
      clearSuccessAlert();
    };
  }, [clearSuccessAlert]);

  useEffect(() => {
    // Set the focus on the page's focus target _unless_ one of the following is true:
    // - there is a hash in the URL and there is a named-anchor that matches
    //   the hash
    // - the user just came to this route via the root profile route. If a
    //   user got to the Profile via a link to /profile or /profile/ we want
    //   to focus on the "Profile" sub-nav H1, not the H2 on this page, for
    //   a11y reasonse

    const cameFromProfileRoot = Boolean(
      lastLocation?.pathname?.match(
        new RegExp(`${PROFILE_PATHS.PROFILE_ROOT}/?$`),
      ),
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

    // early return if for profile referrer
    if (cameFromProfileRoot) return cleanup;

    // early return if no hash > focus on default focus target
    if (!hash) {
      focusElement('[data-focus-target]');
      return cleanup;
    }

    const selector = hash; // hash already includes leading '#'

    // For edit hashes, prefer the associated edit button; else fall back to transformed target
    const editButton = getEditButtonFromHash(hash);
    const scrollTarget =
      editButton || getScrollTarget(hash) || document.querySelector(selector);

    /**
     * Refactored/Expanded the waitForRenderThenFocus/focusElement logic here to allow for a staged scroll+focus with delays to ensure the target is ready and layout is stable before moving focus, improving accessibility.
     *
     * This helper coordinates a safe, user-friendly scroll+focus sequence to a target element referenced by the URL hash. It deliberately staggers work across animation frames and short timeouts so the page layout and any web components can finish rendering before focus is moved.
     *
     * Key points:
     *  - Early exit if no element or the effect is cancelled (during cleanup).
     *  - Two requestAnimationFrame hops allow the browser to flush layout and paint, avoiding jank.
     *  - After a brief delay, it scrolls the element into view smoothly.
     *  - If the target is a VA web component “va-button” with a shadow DOM, it defers to waitForRenderThenFocus to focus the internal button safely.
     *  - Otherwise, it sets a temporary tabindex="-1" if needed so the element can be programmatically focused, then calls focusElement.
     *  - All timers/raf handles are tracked so the effect’s cleanup can cancel pending work, preventing memory leaks or focusing after navigation changes.
     *
     * This staged approach prevents race conditions where immediate focus would fail (element not yet in the DOM, not yet upgraded as a web component, or layout still shifting), and improves accessibility by ensuring the correct control receives focus only after it is reliably ready.
     */
    const focusAndScroll = el => {
      if (!el || cancelled) return;

      // Wait for layout to stabilize with multiple frames
      rafId1 = requestAnimationFrame(() => {
        if (cancelled) return;
        rafId2 = requestAnimationFrame(() => {
          if (cancelled) return;
          scrollTimeoutId = setTimeout(() => {
            if (cancelled) return;
            if (typeof el.scrollIntoView === 'function') {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
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
              }, 250);
            }
          }, 150);
        });
      });
    };

    // if hash already present, focus and scroll right away
    // If original hash selector exists use it; otherwise if we have an editButton use that directly
    const existing = document.querySelector(selector);
    if (existing || editButton) {
      focusAndScroll(scrollTarget || existing || editButton);
      return cleanup;
    }

    // retry loop with timeout to wait for element to appear
    let attempts = 0;
    const maxAttempts = 10;
    const intervalMs = 150;

    const retry = () => {
      if (cancelled) return;
      // Re-query for either the hash target or (for edit hashes) the button
      const el =
        document.querySelector(selector) || getEditButtonFromHash(hash);
      if (el) {
        focusAndScroll(scrollTarget || el);
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        retryTimeoutId = setTimeout(retry, intervalMs);
      } else {
        // Fallback for unsupported or missing hash targets: focus default target
        focusElement('[data-focus-target]');
      }
    };
    retry();

    return cleanup;
  }, [lastLocation]);

  useEffect(() => {
    // Show alert when navigating away
    if (hasUnsavedEdits) {
      window.onbeforeunload = () => '';
      return;
    }

    window.onbeforeunload = undefined;
  }, [hasUnsavedEdits]);

  useEffect(() => {
    return () => {
      openEditModal(null);
    };
  }, [openEditModal]);

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
