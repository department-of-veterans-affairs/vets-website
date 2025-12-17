import React, { useEffect } from 'react';

import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagingSignature } from 'platform/user/profile/actions';
import { isVAPatient } from '~/platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import Headline from '../ProfileSectionHeadline';
import { ProfileInfoSection } from '../ProfileInfoSection';
import MessagingSignature from '../personal-information/MessagingSignature';
import NonVAPatientMessage from '../personal-health-care-contacts/NonVAPatientMessage';

const MessageSignature = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const vaPatient = useSelector(isVAPatient);
  const userServices = useSelector(state => state.user.profile.services);
  const isMessagingServiceEnabled = userServices.includes(
    backendServices.MESSAGING,
  );

  const messagingSignature = useSelector(
    state => state.user?.profile?.mhvAccount?.messagingSignature,
  );
  const messagingSignatureName = messagingSignature?.signatureName;
  const hasMessagingSignatureError = messagingSignature?.error !== undefined;

  useEffect(
    () => {
      if (isMessagingServiceEnabled && messagingSignature == null)
        dispatch(getMessagingSignature());
    },
    [dispatch, isMessagingServiceEnabled, messagingSignature],
  );

  useEffect(
    () => {
      const fieldName = `#${FIELD_IDS[FIELD_NAMES.MESSAGING_SIGNATURE]}`;
      if (messagingSignatureName !== null && location.hash === fieldName) {
        const targetElement = document.querySelector(fieldName);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          focusElement(targetElement.querySelector('h2'));
        }
      }
    },
    [messagingSignatureName, location.hash],
  );

  const signaturePresent =
    !!messagingSignature?.signatureName?.trim() &&
    !!messagingSignature?.signatureTitle?.trim();

  const cardFields = [
    {
      // title: FIELD_TITLES[FIELD_NAMES.MESSAGING_SIGNATURE],
      description: 'Choose edit to add a message signature.',
      id: FIELD_IDS[FIELD_NAMES.MESSAGING_SIGNATURE],
      value: (
        <MessagingSignature
          hasError={hasMessagingSignatureError}
          fieldName={FIELD_NAMES.MESSAGING_SIGNATURE}
          signaturePresent={signaturePresent}
        />
      ),
    },
  ];
  return (
    <>
      <Headline>Messages signature</Headline>
      {vaPatient ? (
        <>
          <p>
            You can add a signature to the messages you send to your health care
            providers.
          </p>
          <p>
            <VaLink
              href="/my-health/secure-messages/inbox"
              text="Review your messages in your inbox"
            />
          </p>

          <ProfileInfoSection data={cardFields} level={1} />
        </>
      ) : (
        <NonVAPatientMessage />
      )}
    </>
  );
};

MessageSignature.propTypes = {};

export default MessageSignature;
