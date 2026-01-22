import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import InitializeVAPServiceID from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import ProfileInformationFieldController from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  REVIEW_CONTACT,
  setReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { usePrevious } from 'platform/utilities/react-hooks';
import { withRouter } from 'react-router';
import { refreshProfile, sanitizeUrl } from 'platform/user/exportsFile';
import {
  ContactInfoFormAppConfigProvider,
  useContactInfoFormAppConfig,
} from '@@vap-svc/components/ContactInfoFormAppConfigContext';
import { useRouteMetadata } from '../hooks/useRouteMetadata';

export const BuildPageBase = ({
  title,
  field,
  id,
  goToPath,
  contactPath,
  editContactInfoHeadingLevel,
  router,
  prefillPatternEnabled,
  ...rest
}) => {
  const dispatch = useDispatch();
  const Heading = editContactInfoHeadingLevel || 'h3';
  const headerRef = useRef(null);
  const contactInfoFormAppConfig = useContactInfoFormAppConfig();

  const modalState = useSelector(state => state?.vapService.modal);
  const prevModalState = usePrevious(modalState);

  const routeMetadata = useRouteMetadata(router);

  const sanitizedPrefix = sanitizeUrl(routeMetadata?.urlPrefix || '');

  const fullContactPath = `${sanitizedPrefix}/${contactPath}`;
  const fullReviewPath = `${sanitizedPrefix}/review-and-submit`;

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
  const returnPath = onReviewPage ? fullReviewPath : fullContactPath;

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
    success: async () => {
      setReturnState(id, 'updated');
      await dispatch(refreshProfile);
      goToPath(returnPath);
    },
  };

  return (
    <ContactInfoFormAppConfigProvider
      value={{
        ...rest,
        goToPath,
        returnPath,
        prefillPatternEnabled,
        fieldName: FIELD_NAMES[field],
        formKey: router?.location?.state?.formKey || id,
        keys: router?.location?.state?.keys || { wrapper: 'contactInfo' },
      }}
    >
      <div className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
        <InitializeVAPServiceID>
          {field !== 'MAILING_ADDRESS' && (
            <va-alert status="info" visible slim>
              <p className="vads-u-margin--0">
                Any changes you make will also be reflected on your VA.gov
                profile.
              </p>
            </va-alert>
          )}
          <Heading ref={headerRef} className="vads-u-font-size--h3">
            {title}
          </Heading>
          <ProfileInformationFieldController
            forceEditView
            fieldName={FIELD_NAMES[field]}
            isDeleteDisabled
            cancelCallback={handlers.cancel}
            successCallback={handlers.success}
            saveButtonText="Update"
            prefillPatternEnabled={prefillPatternEnabled}
            contactInfoFormAppConfig={contactInfoFormAppConfig}
          />
        </InitializeVAPServiceID>
      </div>
    </ContactInfoFormAppConfigProvider>
  );
};

BuildPageBase.propTypes = {
  router: PropTypes.shape({
    location: PropTypes.object,
  }).isRequired,
  contactPath: PropTypes.string,
  editContactInfoHeadingLevel: PropTypes.string,
  field: PropTypes.string,
  goToPath: PropTypes.func,
  id: PropTypes.string,
  prefillPatternEnabled: PropTypes.bool,
  title: PropTypes.string,
};

const BuildPage = withRouter(BuildPageBase);

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
