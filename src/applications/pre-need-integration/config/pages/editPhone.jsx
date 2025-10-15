import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import InitializeVAPServiceID from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

import { focusElement } from 'platform/utilities/ui/focus';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import { usePrevious } from 'platform/utilities/react-hooks';

const EditPhone = ({ goToPath, contentAfterButtons }) => {
  const headerRef = useRef(null);
  const modalState = useSelector(state => state?.vapService.modal);
  const prevModalState = usePrevious(modalState);

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  useEffect(
    () => {
      const shouldFocusOnHeaderRef =
        prevModalState === 'addressValidation' && modalState === 'mobilePhone';

      if (shouldFocusOnHeaderRef) {
        setTimeout(() => {
          focusElement(headerRef?.current);
        }, 250);
      }
    },
    [modalState, prevModalState],
  );

  const handlers = {
    onSubmit: event => {
      event.stopPropagation();
    },
    cancel: () => {
      setReturnState('phone', 'canceled');
      goToPath('applicant-contact-details-logged-in', { force: true });
    },
    success: () => {
      setReturnState('phone', 'updated');
      goToPath('applicant-contact-details-logged-in', { force: true });
    },
  };

  return (
    <div>
      <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
        <InitializeVAPServiceID>
          <va-alert status="info" visible slim>
            <p className="vads-u-margin--0">
              Any changes you make will also be reflected on your VA.gov
              profile.
            </p>
          </va-alert>
          <h3 ref={headerRef} className="vads-u-font-size--h3">
            Edit your contact information
          </h3>
          <p>We may contact you at the phone number you provide here.</p>
          <ProfileInformationFieldController
            forceEditView
            fieldName={FIELD_NAMES.MOBILE_PHONE}
            isDeleteDisabled
            cancelCallback={handlers.cancel}
            successCallback={handlers.success}
            saveButtonText="Update"
            title="Phone number"
          />
        </InitializeVAPServiceID>
      </div>
      {contentAfterButtons}
    </div>
  );
};

export default EditPhone;
