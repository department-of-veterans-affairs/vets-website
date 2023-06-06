import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as VAP_SERVICE from 'platform/user/profile/vap-svc/constants';

import ProfileFormContainerVAFSC from './ProfileFormContainerVAFSC';
import PhoneWithExtension from './contact-information/phone-numbers/vafsc/PhoneWithExtension';

const renderActiveField = (fieldName, props) => {
  switch (fieldName) {
    case VAP_SERVICE.FIELD_NAMES.HOME_PHONE:
    case VAP_SERVICE.FIELD_NAMES.MOBILE_PHONE:
    case VAP_SERVICE.FIELD_NAMES.WORK_PHONE:
      return <PhoneWithExtension {...props} />;
    default:
      // eslint-disable-next-line no-console
      return console.error(
        'No matching field passed to ProfileInformationEditViewVAFSC',
      );
  }
};

export const ProfileInformationEditViewVAFSC = props => {
  const formRef = useRef();

  const { fieldName, forceEditView } = props;

  const focusOnFirstFormElement = useCallback(
    () => {
      if (forceEditView) {
        // Showing the edit view on its own page, so let the app handle focus
        return;
      }
      // TODO: is there a better way to ensure focus inside a web comp on render?
      // setting timeout for event so that input in web component can get focus,
      // otherwise web component will not render by time querySelector is fired
      setTimeout(() => {
        const fieldElements = 'button, input, select, a, textarea';
        const focusableShadowElement = formRef?.current
          ?.querySelector('va-text-input')
          .shadowRoot?.querySelector(fieldElements);

        const focusableDomElement = formRef?.current?.querySelector(
          fieldElements,
        );
        if (focusableShadowElement) {
          focusableShadowElement?.focus();
          return;
        }
        if (focusableDomElement) {
          focusableDomElement.focus();
        }
      }, 50);
    },
    [formRef],
  );

  useEffect(() => focusOnFirstFormElement(), []);

  return (
    <>
      <ProfileFormContainerVAFSC formRef={formRef} {...props}>
        {renderActiveField(fieldName, props)}
      </ProfileFormContainerVAFSC>
    </>
  );
};

ProfileInformationEditViewVAFSC.propTypes = {
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  forceEditView: PropTypes.bool,
  title: PropTypes.string,
};

export default ProfileInformationEditViewVAFSC;
