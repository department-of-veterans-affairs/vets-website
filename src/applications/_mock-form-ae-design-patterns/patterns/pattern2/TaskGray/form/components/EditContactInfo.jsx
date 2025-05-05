import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import InitializeVAPServiceID from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { usePrevious } from 'platform/utilities/react-hooks';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import ProfileInformationFieldController from './ProfileInformationFieldController';

export const BuildPage = props => {
  const { title, field, id, goToPath, subTitle } = props;

  const headerRef = useRef(null);

  const modalState = useSelector(state => state?.vapService?.modal);
  const prevModalState = usePrevious(modalState);

  useEffect(() => {
    if (headerRef?.current) {
      focusElement(headerRef?.current);
    }
  }, [headerRef]);

  useEffect(() => {
    const shouldFocusOnHeaderRef =
      prevModalState === 'addressValidation' && modalState === 'mailingAddress';

    // we do this to make sure focus is set when cancelling out of address validation UI
    if (shouldFocusOnHeaderRef) {
      setTimeout(() => {
        focusElement(headerRef?.current);
      }, 250);
    }
  }, [modalState, prevModalState]);

  const returnPath = '/2/task-gray/veteran-information';

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
    <>
      <va-alert>
        We’ve prefilled some of your information. If you need to make changes,
        you can edit on this screen.{' '}
        <strong>
          Your changes will affect this form and your VA.gov profile.
        </strong>
      </va-alert>
      <h2
        ref={headerRef}
        className="vads-u-margin-top--3 vads-u-margin-bottom--3"
      >
        {title}
      </h2>
      <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
        <InitializeVAPServiceID>
          {subTitle && <p className="vads-u-color--gray-medium">{subTitle}</p>}
          <ProfileInformationFieldController
            forceEditView
            fieldName={FIELD_NAMES[field]}
            isDeleteDisabled
            cancelCallback={handlers.cancel}
            successCallback={handlers.success}
            saveButtonText="Save to profile"
          />
        </InitializeVAPServiceID>
      </div>
    </>
  );
};

BuildPage.propTypes = {
  contactPath: PropTypes.string,
  data: PropTypes.object,
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
