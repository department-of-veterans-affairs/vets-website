import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { profileShowPronounsAndSexualOrientation } from '@@profile/selectors';

import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import { renderDOB } from '@@profile/util/personal-information/personalInformationUtils';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ProfileInfoCard } from '../ProfileInfoCard';
import GenderIdentityDescription from './GenderIdentityDescription';
import LegalName from './LegalName';
import DisabilityRating from './DisabilityRating';

const LegalNameDescription = () => (
  <va-additional-info trigger="How to update your legal name">
    <p className="vads-u-margin-top--0">
      If you’ve changed your legal name, you’ll need to tell us so we can change
      your name in our records.
    </p>
    <p className="vads-u-margin-bottom--0">
      <a href="/resources/how-to-change-your-legal-name-on-file-with-va">
        Learn how to change your legal name on file with VA
      </a>
    </p>
  </va-additional-info>
);

const PersonalInformationSection = ({
  dob,
  shouldShowPronounsAndSexualOrientation,
}) => {
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
    ...(shouldShowPronounsAndSexualOrientation
      ? [
          {
            title: 'Pronouns',
            id: FIELD_IDS[FIELD_NAMES.PRONOUNS],
            value: (
              <ProfileInformationFieldController
                fieldName={FIELD_NAMES.PRONOUNS}
                isDeleteDisabled
              />
            ),
          },
        ]
      : []),
    {
      title: 'Gender identity',
      description: <GenderIdentityDescription />,
      id: FIELD_IDS[FIELD_NAMES.GENDER_IDENTITY],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.GENDER_IDENTITY}
          isDeleteDisabled
        />
      ),
    },
    ...(shouldShowPronounsAndSexualOrientation
      ? [
          {
            title: 'Sexual orientation',
            id: FIELD_IDS[FIELD_NAMES.SEXUAL_ORIENTATION],
            value: (
              <ProfileInformationFieldController
                fieldName={FIELD_NAMES.SEXUAL_ORIENTATION}
                isDeleteDisabled
              />
            ),
          },
        ]
      : []),
    {
      title: 'Disability rating',
      value: <DisabilityRating />,
    },
  ];

  return (
    <div className="vads-u-margin-bottom--6">
      <div className="vads-u-margin-bottom--3">
        <va-additional-info trigger="How to fix an error in your name or date of birth">
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
            <a href="/find-locations/">Find your VA medical center</a>
            <p className="vads-u-margin-bottom--0 vads-u-padding-right--0 small-screen:vads-u-padding-right--6">
              <span className="vads-u-font-weight--bold vads-u-display--block">
                If you receive VA benefits, but aren’t enrolled in VA health
                care
              </span>
              Call us at <va-telephone contact="8008271000" /> (
              <va-telephone contact={CONTACTS['711']} tty />
              ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
          </div>
        </va-additional-info>
      </div>
      <ProfileInfoCard data={cardFields} level={1} />
    </div>
  );
};

PersonalInformationSection.propTypes = {
  dob: PropTypes.string.isRequired,
  shouldShowPronounsAndSexualOrientation: PropTypes.bool.isRequired,
  gender: PropTypes.string,
};

const mapStateToProps = state => ({
  dob: state.vaProfile?.personalInformation?.birthDate,
  preferredName: state.vaProfile?.personalInformation?.preferredName,
  pronouns: state.vaProfile?.personalInformation?.pronouns,
  genderIdentity: state.vaProfile?.personalInformation?.genderIdentity,
  sexualOrientation: state.vaProfile?.personalInformation?.sexualOrientation,
  shouldShowPronounsAndSexualOrientation: profileShowPronounsAndSexualOrientation(
    state,
  ),
});

export default connect(mapStateToProps)(PersonalInformationSection);
