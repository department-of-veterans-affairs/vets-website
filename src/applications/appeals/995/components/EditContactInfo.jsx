import React from 'react';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from '@@vap-svc/constants';

import { CONTACT_INFO_PATH } from '../constants';

const buildPage = ({ title, field, goToPath }) => {
  const onReviewPage = window.sessionStorage.getItem('onReviewPage') === 'true';
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
      goToPath(returnPath);
    },
    success: () => {
      goToPath(returnPath);
    },
  };

  return (
    <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
      <InitializeVAPServiceID>
        <h3>{title}</h3>
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

export const EditHomePhone = ({ title, goToPath }) =>
  buildPage({ title, goToPath, field: 'HOME_PHONE' });

export const EditMobilePhone = ({ title, goToPath }) =>
  buildPage({ title, goToPath, field: 'MOBILE_PHONE' });

export const EditEmail = ({ title, goToPath }) =>
  buildPage({ title, goToPath, field: 'EMAIL' });

export const EditAddress = ({ title, goToPath }) =>
  buildPage({ title, goToPath, field: 'MAILING_ADDRESS' });
