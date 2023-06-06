import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// import {
//   ProfileInformationFieldController,
//   InitializeVAPServiceID,
//   FIELD_NAMES,
// } from '@department-of-veterans-affairs/platform-user/exports';

// import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
// import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
// import { FIELD_NAMES } from '@@vap-svc/constants';

import InitializeVAPServiceID from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { REVIEW_CONTACT, setReturnState } from '../utilities/data/profile';

export const BuildPage = ({ title, field, id, goToPath, contactPath }) => {
  const headerRef = useRef(null);

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const onReviewPage = window.sessionStorage.getItem(REVIEW_CONTACT) === 'true';
  const returnPath = onReviewPage ? '/review-and-submit' : `/${contactPath}`;

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
    <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
      <InitializeVAPServiceID>
        <h3 ref={headerRef}>{title}</h3>
        <ProfileInformationFieldController
          forceEditView
          fieldName={FIELD_NAMES[field]}
          isDeleteDisabled
          cancelCallback={handlers.cancel}
          successCallback={handlers.success}
        />
      </InitializeVAPServiceID>
    </div>
  );
};

BuildPage.propTypes = {
  contactPath: PropTypes.string,
  field: PropTypes.string,
  goToPath: PropTypes.func,
  id: PropTypes.string,
  title: PropTypes.string,
};

export const EditHomePhone = props => (
  <BuildPage {...props} field="HOME_PHONE" id="home-phone" />
);

export const EditMobilePhone = props => (
  <BuildPage {...props} field="MOBILE_PHONE" id="mobile-phone" />
);

export const EditEmail = props => (
  <BuildPage {...props} field="EMAIL" id="email" />
);

export const EditAddress = props => (
  <BuildPage {...props} field="MAILING_ADDRESS" id="address" />
);
