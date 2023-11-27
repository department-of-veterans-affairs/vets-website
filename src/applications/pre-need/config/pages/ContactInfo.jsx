import React, { useEffect, useRef } from 'react';

import { FIELD_NAMES } from '@@vap-svc/constants';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { focusElement } from 'platform/utilities/ui';

const ContactInfo = () => {
  const field = 'MAILING_ADDRESS';
  const title = 'Hello Mate';

  const headerRef = useRef(null);

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    cancel: () => {},
    success: () => {},
  };

  return (
    <div
      className="va-profile-wrapper"
      onSubmit={handlers.onSubmit}
      id={`edit-${FIELD_NAMES[field]}`}
    >
      <InitializeVAPServiceID>
        <h3 ref={headerRef}>{title}</h3>
        <ProfileInformationFieldController
          forceEditView
          fieldName={FIELD_NAMES[field]}
          isDeleteDisabled
          cancelCallback={handlers.cancel}
          successCallback={handlers.success}
          saveButtonText="Update"
        />
      </InitializeVAPServiceID>
    </div>
  );
};

export default ContactInfo;
