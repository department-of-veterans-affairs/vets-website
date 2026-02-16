import React, { useEffect, useCallback, useRef } from 'react';

import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { openModal, clearMostRecentlySavedField } from '@@vap-svc/actions';
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import { Prompt, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagingSignature } from 'platform/user/profile/actions';
import { isVAPatient } from '~/platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import Headline from '../ProfileSectionHeadline';
import { ProfileInfoSection } from '../ProfileInfoSection';
import MessagingSignature from '../personal-information/MessagingSignature';
import NonVAPatientMessage from '../personal-health-care-contacts/NonVAPatientMessage';

const MessagesSignature = () => {
  const hasMountedRef = useRef(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const vaPatient = useSelector(isVAPatient);
  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );
  const userServices = useSelector(state => state.user.profile.services);
  const isMessagingServiceEnabled = userServices.includes(
    backendServices.MESSAGING,
  );

  const messagingSignature = useSelector(
    state => state.user?.profile?.mhvAccount?.messagingSignature,
  );
  const messagingSignatureName = messagingSignature?.signatureName;
  const hasMessagingSignatureError = messagingSignature?.error !== undefined;

  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );
  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(
    () => {
      document.title = `Messages signature | Veterans Affairs`;
      // Mark component as mounted after first render so Prompt doesn't show on initial load
      hasMountedRef.current = true;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert],
  );

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

  useEffect(
    () => {
      // Show alert when navigating away
      if (hasUnsavedEdits) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [hasUnsavedEdits],
  );

  useEffect(
    () => {
      return () => {
        openEditModal(null);
      };
    },
    [openEditModal],
  );

  const signaturePresent =
    !!messagingSignature?.signatureName?.trim() &&
    !!messagingSignature?.signatureTitle?.trim();

  const cardFields = [
    {
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
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedEdits && hasMountedRef.current}
      />

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

MessagesSignature.propTypes = {};

export default MessagesSignature;
