import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

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

import { usePrevious } from 'platform/utilities/react-hooks';
import {
  REVIEW_CONTACT,
  setReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { PrefillAlert } from '../PrefillAlert';

export const BuildPage = ({
  title,
  field,
  id,
  goToPath,
  contactPath,
  saveButtonText,
  subTitle,
}) => {
  const headerRef = useRef(null);

  const modalState = useSelector(state => state?.vapService?.modal);
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
        prevModalState === 'addressValidation' &&
        modalState === 'mailingAddress';

      // we do this to make sure focus is set when cancelling out of address validation UI
      if (shouldFocusOnHeaderRef) {
        setTimeout(() => {
          focusElement(headerRef?.current);
        }, 250);
      }
    },
    [modalState, prevModalState],
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
    <div
      className="va-profile-wrapper vads-u-margin-top--1"
      onSubmit={handlers.onSubmit}
    >
      <InitializeVAPServiceID>
        <PrefillAlert />
        <h1
          className="vads-u-font-size--h2 vads-u-margin-top--3"
          ref={headerRef}
        >
          {title}
        </h1>
        {subTitle && <p className="vads-u-color--gray-medium">{subTitle}</p>}
        <ProfileInformationFieldController
          forceEditView
          fieldName={FIELD_NAMES[field]}
          isDeleteDisabled
          cancelCallback={handlers.cancel}
          successCallback={handlers.success}
          saveButtonText={saveButtonText}
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
  saveButtonText: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
};

export const EditMailingAddressTaskYellow = props => {
  return <BuildPage {...props} field="MAILING_ADDRESS" id="address" />;
};
