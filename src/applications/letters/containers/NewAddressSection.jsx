import React, { useEffect, useRef, useState } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { TRANSACTION_CATEGORY_TYPES, FIELD_NAMES } from '@@vap-svc/constants';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

export function NewAddressSection({ success }) {
  const successRef = useRef(null);
  const ariaLiveRef = useRef(null);

  const [checkboxIntercepted, setCheckboxIntercepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(
    () => {
      if (success && successRef?.current) {
        focusElement('h3', {}, successRef.current);
      }
    },
    [success],
  );

  useEffect(
    () => {
      // check for the presence of the edit button
      // if it is there, we are not editing; if it is not there, we are editing
      const updateIsEditingState = () => {
        const editButton = document.querySelector(
          'va-button#edit-mailing-address',
        );
        setIsEditing(!editButton);
      };

      // call this on load
      updateIsEditingState();

      // observe DOM changes if the button may appear/disappear dynamically
      // call it again when changes occur to make sure we are tracking the presence correctly
      const observer = new MutationObserver(updateIsEditingState);
      observer.observe(document.body, { childList: true, subtree: true });

      // cleanup
      return () => observer.disconnect();
    },
    [setIsEditing],
  );

  // Reset the intercepted flag when editing mode changes
  useEffect(
    () => {
      setCheckboxIntercepted(false);
    },
    [isEditing],
  );

  useEffect(
    () => {
      // Try to find the first checkbox inside the ProfileInformationFieldController
      // This selector may need to be adjusted if the structure changes
      const container = document.querySelector('.va-profile-wrapper');

      // Find the first visible checkbox
      const checkbox = container?.querySelector('va-checkbox');

      // Handler for focus event
      const onCheckboxFocus = event => {
        if (checkboxIntercepted) return;
        event.preventDefault();
        // Focus the aria-live region
        if (ariaLiveRef.current) {
          ariaLiveRef.current.focus();
        }
        setCheckboxIntercepted(true);
        // After 0.5s, focus the native input inside va-checkbox if possible
        setTimeout(() => {
          const nativeInput =
            checkbox.shadowRoot &&
            checkbox.shadowRoot.querySelector('input[type="checkbox"]');
          if (nativeInput) {
            nativeInput.focus();
          } else {
            checkbox.focus();
          }
        }, 300);
      };

      // Attach the event listener
      if (isEditing) {
        checkbox?.addEventListener('focus', onCheckboxFocus, true);
      }

      // Cleanup
      return () =>
        checkbox?.removeEventListener('focus', onCheckboxFocus, true);
    },
    [isEditing, checkboxIntercepted],
  );

  return (
    <div className="va-profile-wrapper">
      <InitializeVAPServiceID>
        <VAPServicePendingTransactionCategory
          categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}
        >
          <h2>Verify your mailing address</h2>
          <p>
            This mailing address will be listed on your benefit letters and
            documentation. You can edit this address.
          </p>
          <va-alert status="info" class="vads-u-margin-bottom--3">
            <p className="vads-u-margin-y--0">
              Changing your address here will also update it in your VA.gov
              profile. We use this address for several VA benefits and services.
              <br />
              <a
                href="https://www.va.gov/change-address/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn about changing your address in your VA.gov profile (opens
                in new tab)
              </a>
            </p>
          </va-alert>

          {success && (
            <va-alert
              status="success"
              class="vads-u-margin-top--3 vads-u-margin-bottom--3"
              ref={successRef}
            >
              <h3 slot="headline">We've updated your mailing address</h3>
              <p>
                We've made these changes to the letters you download now and to
                your VA.gov profile.
              </p>
            </va-alert>
          )}
          <va-card className="vads-u-justify-content--space-between">
            <h3 className="vads-u-margin-top--0">Your mailing address</h3>
            <div
              aria-live="polite"
              aria-relevant="all"
              className="sr-only"
              aria-atomic="true"
              tabIndex="-1"
              ref={ariaLiveRef}
            >
              {isEditing ? 'Edit address mode is active.' : ''}
            </div>
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.MAILING_ADDRESS}
            />
          </va-card>
        </VAPServicePendingTransactionCategory>
      </InitializeVAPServiceID>
    </div>
  );
}

NewAddressSection.propTypes = {
  success: PropTypes.bool,
};

export default NewAddressSection;
