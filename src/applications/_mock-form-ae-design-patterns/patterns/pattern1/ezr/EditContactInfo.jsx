import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import InitializeVAPServiceID from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { usePrevious } from 'platform/utilities/react-hooks';
import {
  REVIEW_CONTACT,
  setReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';

import { Link } from 'react-router';
import NameTag from '../../../shared/components/NameTag';
import { Portal } from '../../../shared/components/Portal';
import CopyResidentialAddress from '../../../shared/components/CopyResidentialAddress';

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

  const header = document.querySelector('header');

  return (
    <div
      className="va-profile-wrapper vads-u-margin-top--neg4"
      onSubmit={handlers.onSubmit}
    >
      <Portal target={header} prepend={false}>
        <NameTag />
      </Portal>

      <Link to={contactPath}>
        <va-icon
          icon="chevron_left"
          size="2"
          style={{ position: 'relative', top: '-4px', right: '-2px' }}
        />{' '}
        Back to last page
      </Link>
      <InitializeVAPServiceID>
        <h1
          className="vads-u-font-size--h2 vads-u-margin-top--3"
          ref={headerRef}
        >
          {title}
        </h1>
        {subTitle && <p className="vads-u-color--gray-medium">{subTitle}</p>}

        {field === 'MAILING_ADDRESS' && <CopyResidentialAddress />}

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

export const EditHomePhone = props => (
  <BuildPage {...props} field="HOME_PHONE" id="home-phone" />
);

export const EditMobilePhone = props => (
  <BuildPage {...props} field="MOBILE_PHONE" id="mobile-phone" />
);

export const EditEmail = props => (
  <BuildPage {...props} field="EMAIL" id="email" />
);

export const EditAddress = props => {
  return <BuildPage {...props} field="MAILING_ADDRESS" id="address" />;
};
