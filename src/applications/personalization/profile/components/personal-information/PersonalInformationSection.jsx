import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { profileShowPronounsAndSexualOrientation } from '@@profile/selectors';

import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import { renderDOB } from '@@profile/util/personal-information/personalInformationUtils';
import ProfileInfoTable from '../ProfileInfoTable';
import GenderIdentityAdditionalInfo from './GenderIdentityAdditionalInfo';

const PersonalInformationSection = ({
  dob,
  shouldShowPronounsAndSexualOrientation,
}) => {
  const tableFields = [
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
      description: <GenderIdentityAdditionalInfo />,
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
  ];

  return (
    <div className="vads-u-margin-bottom--6">
      <div className="vads-u-margin-bottom--3">
        <va-additional-info trigger="How to update your legal name">
          <p className="vads-u-margin-top--0">
            If you’ve changed your legal name, you’ll need to tell us so we can
            change your name in our records.
          </p>
          <p className="vads-u-margin-bottom--0">
            <a href="/resources/how-to-change-your-legal-name-on-file-with-va">
              Learn how to change your legal name on file with VA
            </a>
          </p>
        </va-additional-info>
      </div>
      <div className="vads-u-margin-bottom--3">
        <va-additional-info trigger="How to fix an error in your name or date of birth">
          <p className="vads-u-margin-top--0">
            If our records have a misspelling or other error in your name or
            date of birth, you can request a correction. We’ll ask for a current
            photo ID that shows proof of the correct information. We’ll accept a
            government-issued photo ID, driver’s license, or passport as proof.
          </p>
          <p>Here’s how to request a correction:</p>
          <p>
            <span className="vads-u-font-weight--bold vads-u-display--block ">
              If you’re enrolled in the VA health care program
            </span>
            Please contact your nearest VA medical center to update your
            personal information.
          </p>
          <a href="/find-locations/">Find your nearest VA medical center</a>
          <p className="vads-u-margin-bottom--0">
            <span className="vads-u-font-weight--bold vads-u-display--block">
              If you receive VA benefits, but aren’t enrolled in VA health care
            </span>
            Call us at <va-telephone contact="800-827-1000" /> (
            <a href="tel:711" aria-label="TTY: 7 1 1.">
              TTY: +711
            </a>
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          </p>
        </va-additional-info>
      </div>
      <ProfileInfoTable data={tableFields} level={2} />
    </div>
  );
};

PersonalInformationSection.propTypes = {
  dob: PropTypes.string.isRequired,
  shouldProfileShowGender: PropTypes.bool.isRequired,
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
