import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { FIELD_IDS, FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import { renderDOB } from '@@vap-svc/util/personal-information/personalInformationUtils';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { getMessagingSignature } from 'platform/user/profile/actions';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { ProfileInfoSection } from '../ProfileInfoSection';
import LegalName from './LegalName';
import DisabilityRating from './DisabilityRating';
import MessagingSignature from './MessagingSignature';
import { PROFILE_PATHS } from '../../constants';
import { handleRouteChange } from '../../helpers';

const LegalNameDescription = () => (
  <va-additional-info trigger="How to update your legal name" uswds>
    <div>
      <p className="vads-u-margin-top--0 vads-u-color--black">
        If you’ve changed your legal name, you’ll need to tell us so we can
        change your name in our records.
      </p>
      <p className="vads-u-margin-bottom--0">
        <va-link
          href="/resources/how-to-change-your-legal-name-on-file-with-va"
          text="Learn how to change your legal name on file with VA"
        />
      </p>
    </div>
  </va-additional-info>
);

const PersonalInformationSection = ({ dob }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const userServices = useSelector(state => state.user.profile.services);
  const isMessagingServiceEnabled = userServices.includes(
    backendServices.MESSAGING,
  );
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isProfile2Enabled = useToggleValue(TOGGLE_NAMES.profile2Enabled);
  const isHealthCareSettingsEnabled = useToggleValue(
    TOGGLE_NAMES.profileHealthCareSettingsPage,
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

  const updatedCardFields = useMemo(
    () => {
      const cardFields = [
        {
          title: 'Legal name',
          description: <LegalNameDescription />,
          value: <LegalName />,
        },
        { title: 'Date of birth', value: renderDOB(dob) },
        {
          title: 'Preferred name',
          description:
            "Share this information if you'd like us to use a first name that's different from your legal name when you come in to VA.",
          id: FIELD_IDS[FIELD_NAMES.PREFERRED_NAME],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.PREFERRED_NAME}
              isDeleteDisabled
            />
          ),
        },
        {
          title: 'Disability rating',
          value: <DisabilityRating />,
        },
      ];

      if (
        isMessagingServiceEnabled &&
        (!isProfile2Enabled || !isHealthCareSettingsEnabled)
      ) {
        const signaturePresent =
          !!messagingSignature?.signatureName?.trim() &&
          !!messagingSignature?.signatureTitle?.trim();
        return [
          ...cardFields,
          {
            title: FIELD_TITLES[FIELD_NAMES.MESSAGING_SIGNATURE],
            description:
              'You can add a signature and signature title to be automatically added to all outgoing secure messages.',
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
      }
      return cardFields;
    },
    [
      dob,
      hasMessagingSignatureError,
      isMessagingServiceEnabled,
      isProfile2Enabled,
      isHealthCareSettingsEnabled,
      messagingSignature,
    ],
  );

  return (
    <div className="vads-u-margin-bottom--6">
      <div className="vads-u-margin-bottom--3">
        <va-additional-info
          trigger="How to fix an error in your name or date of birth"
          uswds
        >
          <div>
            <p className="vads-u-margin-top--0">
              If our records have a misspelling or other error in your name or
              date of birth, you can request a correction. We’ll ask for a
              current photo ID that shows proof of the correct information.
              We’ll accept a government-issued photo ID, driver’s license, or
              passport as proof.
            </p>
            <p>Here’s how to request a correction:</p>
            <p>
              <span className="vads-u-font-weight--bold vads-u-display--block ">
                If you’re enrolled in the VA health care program
              </span>
              Contact your VA medical center.
            </p>
            <va-link
              href="/find-locations/"
              text="Find your VA medical center"
            />
            <p className="vads-u-margin-bottom--0 vads-u-padding-right--0 mobile-lg:vads-u-padding-right--6">
              <span className="vads-u-font-weight--bold vads-u-display--block">
                If you receive VA benefits, but aren’t enrolled in VA health
                care
              </span>
              Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
              <va-telephone contact={CONTACTS['711']} tty />
              ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
          </div>
        </va-additional-info>
      </div>
      <ProfileInfoSection data={updatedCardFields} level={1} />
      {isMessagingServiceEnabled &&
        isProfile2Enabled &&
        isHealthCareSettingsEnabled && (
          <div className="vads-u-margin-top--4">
            <va-alert slim status="info" visible>
              <p className="vads-u-margin-y--0">
                Your health care messages signature has moved to your health
                care settings.{' '}
                <va-link
                  href={PROFILE_PATHS.MESSAGES_SIGNATURE}
                  text="Manage the signature on your messages"
                  onClick={event => handleRouteChange(event, history)}
                />
                .
              </p>
            </va-alert>
          </div>
        )}
    </div>
  );
};

PersonalInformationSection.propTypes = {
  dob: PropTypes.string.isRequired,
  gender: PropTypes.string,
};

const mapStateToProps = state => ({
  dob: state.vaProfile?.personalInformation?.birthDate,
  preferredName: state.vaProfile?.personalInformation?.preferredName || 'none',
  pronouns: state.vaProfile?.personalInformation?.pronouns,
  genderIdentity: state.vaProfile?.personalInformation?.genderIdentity,
  sexualOrientation: state.vaProfile?.personalInformation?.sexualOrientation,
  messagingSignature: state.user?.profile?.mhvAccount?.messagingSignature,
});

export default connect(mapStateToProps)(PersonalInformationSection);
