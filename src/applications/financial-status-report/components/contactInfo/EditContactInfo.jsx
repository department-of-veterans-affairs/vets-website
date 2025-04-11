import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from '@@vap-svc/constants';

import { focusElement } from 'platform/utilities/ui';
import { CONTACT_INFO_PATH, REVIEW_CONTACT } from '../../constants';
import { setReturnState } from '../../utils/contactInformation';

const BuildPage = ({ title, field, id, goToPath }) => {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef?.current) {
      focusElement(headerRef?.current);
    }
  }, [headerRef]);

  const onReviewPage = window.sessionStorage.getItem(REVIEW_CONTACT) === 'true';
  const returnPath = onReviewPage
    ? '/review-and-submit'
    : `/${CONTACT_INFO_PATH}`;

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    cancel: () => {
      setReturnState(id, 'canceled');
      goToPath(returnPath);
    },
    success: () => {
      setReturnState(id, 'updated');
      goToPath(returnPath);
    },
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

BuildPage.propTypes = {
  field: PropTypes.string,
  goToPath: PropTypes.func,
  id: PropTypes.string,
  title: PropTypes.string,
};

export const EditMobilePhone = props => (
  <BuildPage {...props} field="MOBILE_PHONE" id="mobile-phone" />
);

export const EditEmail = props => (
  <BuildPage {...props} field="EMAIL" id="email" />
);

export const EditAddress = props => (
  <BuildPage {...props} field="MAILING_ADDRESS" id="address" />
);
