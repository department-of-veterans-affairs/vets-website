import React, { useEffect, useRef, useState } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { TRANSACTION_CATEGORY_TYPES, FIELD_NAMES } from '@@vap-svc/constants';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

export function NewAddressSection({ success }) {
  const successRef = useRef(null);

  // need state to know whether we are editing
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

  return (
    <div className="va-profile-wrapper">
      <InitializeVAPServiceID>
        <VAPServicePendingTransactionCategory
          categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}
        >
          <h2>Mailing address</h2>
          <p>
            This mailing address will be listed on your benefit letters and
            documentation. You can edit this address.
          </p>
          <va-alert status="info" class="vads-u-margin-bottom--3">
            <p className="vads-u-margin-y--0">
              If you edit the address here, it will also update the address in
              your VA.gov profile and across several VA benefits and services.
              <br />
              <a
                href="https://www.va.gov/change-address/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About changing your address in your VA.gov profile (opens in new
                tab)
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
            <div aria-live="polite" aria-relevant="all" className="sr-only">
              {isEditing && 'Edit address mode is active.'}
            </div>
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.MAILING_ADDRESS}
              ariaDescribedBy={`described-by-${FIELD_NAMES.MAILING_ADDRESS}`}
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
