import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { parse, format } from 'date-fns';
import { genderLabels } from 'platform/static-data/labels';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { InfoSection } from '../../../shared/components/InfoSection';
import { maskSSN } from '../../../utils/helpers/general';
import { USER } from '../../../mocks/constants/user';

const AdditionalInfoContent = () => {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        To protect your personal information, we don’t allow online changes to
        your name, Social Security number, date of birth, or gender. If you need
        change this information, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
        We’ll give you instructions for how to change your information.
      </p>

      <p className="vads-u-margin-bottom--0">
        Or you can learn how to change your legal name on file with VA.{' '}
        <va-link
          external
          text="Learn how to change your legal name (opens in new tab)"
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
        />
      </p>
    </div>
  );
};

const UneditableData = () => {
  const { useFormFeatureToggleSync } = useFeatureToggle();

  useFormFeatureToggleSync(['profileUseExperimental']);

  const name = `${USER.FIRST_NAME} ${USER.MIDDLE_NAME} ${USER.LAST_NAME}`;
  const parsedDob = parse(USER.BIRTH_DATE, 'yyyy-MM-dd', new Date());
  const dob = format(parsedDob, 'MMMM d, yyyy');
  const gender = genderLabels[USER.GENDER];
  const veteranSsn = USER.SSN_LAST_FOUR;
  const maskedSsn = maskSSN(veteranSsn);

  return (
    <div id="uneditable-data">
      <h1 className="vads-u-padding-top--8 vads-u-margin-top--8 vads-u-padding-bottom--9 vads-u-margin-bottom--0">
        Uneditable data
      </h1>

      {/* 1st Option */}
      <h2 className="vads-u-margin-bottom--4 vads-u-margin-top--0">
        Task Orange
      </h2>
      <div className="vads-u-margin-bottom--3 vads-u-padding-left--5">
        <p className="vads-u-font-size--md vads-u-margin-top--4">
          Confirm your information before you continue.
        </p>
        <InfoSection title="Applicant information" titleLevel={3}>
          <dl>
            <InfoSection.InfoBlock label="First name" value={USER.FIRST_NAME} />
            <InfoSection.InfoBlock
              label="Middle name"
              value={USER.MIDDLE_NAME}
            />
            <InfoSection.InfoBlock label="Last name" value={USER.LAST_NAME} />
            <InfoSection.InfoBlock label="Suffix" value="Not provided" />
            <InfoSection.InfoBlock
              label="Social Security number"
              value={maskedSsn}
            />
            <InfoSection.InfoBlock label="Date of birth" value={dob} />
            <InfoSection.InfoBlock label="Gender" value={gender} />
          </dl>
        </InfoSection>

        <va-additional-info
          trigger="How to change this information"
          class="vads-u-padding-bottom--9"
        >
          <AdditionalInfoContent />
        </va-additional-info>
      </div>

      {/* 2nd Option */}
      <div className="vads-u-margin-top--9 vads-u-border-top--2px">
        <h2 className="vads-u-margin-bottom--4 vads-u-margin-top--5">
          Task Gray
        </h2>
        <div className="vads-u-padding-left--5">
          <p className="vads-u-font-size--md">
            Confirm your information before you continue.
          </p>

          <va-card id="locked-card">
            <strong
              className="name dd-privacy-hidden vads-u-font-size--lg"
              data-dd-action-name="Veteran's name"
            >
              {name}
            </strong>

            <p className="ssn">
              <strong>Social Security number: </strong>
              <span data-dd-action-name="Veteran's SSN">{maskedSsn}</span>
            </p>
            <p>
              <strong>Date of birth: </strong>
              {dob}
            </p>
            <p>
              <strong>Gender: </strong>
              <span
                className="gender dd-privacy-hidden"
                data-dd-action-name="Veteran's gender"
              >
                {gender}
              </span>
            </p>
          </va-card>

          <div>
            <p className="vads-u-margin-top--5 vads-u-padding-bottom--9">
              <strong>Note:</strong> To protect your personal information, we
              don’t allow online changes to your name, Social Security number,
              date of birth, or gender. If you need to change this information,
              at <va-telephone contact="8008271000" /> (
              <va-telephone contact={CONTACTS[711]} tty />
              ). We’re here Monday through Friday, between 8:00 a.m. and 9:00
              p.m. ET. We’ll give you instructions for how to change your
              information. Or you can learn how to change your legal name on
              file with VA.{' '}
              <va-link
                external
                text="Learn how to change your legal name (opens in new tab)"
                href="/resources/how-to-change-your-legal-name-on-file-with-va/"
              />
            </p>
          </div>
        </div>
      </div>

      {/* 3rd Option */}
      <div className="vads-u-margin-top--9 vads-u-border-top--2px">
        <h2 className="vads-u-margin-bottom--4 vads-u-margin-top--5">
          Task Blue
        </h2>
        <div className="vads-u-padding-left--5">
          <h3 className="vads-u-margin-y--4">
            Confirm the personal information we have on file for you.
          </h3>

          <va-card background="true" id="gray-locked-card">
            <strong
              className="name dd-privacy-hidden vads-u-font-size--md"
              data-dd-action-name="Veteran's name"
            >
              {name}
            </strong>

            <p className="ssn">
              <strong>Last 4 digits of Social Security number: </strong>
              <span data-dd-action-name="Veteran's SSN">
                {veteranSsn.slice(-4)}
              </span>
            </p>
            <p>
              <strong>Date of birth: </strong>
              {dob}
            </p>
            <p>
              <strong>Gender: </strong>
              <span
                className="gender dd-privacy-hidden"
                data-dd-action-name="Veteran's gender"
              >
                {gender}
              </span>
            </p>
          </va-card>

          <div className="vads-u-padding-bottom--7">
            <p className="vads-u-margin-top--4">
              <strong>Note:</strong> To protect your personal information, we
              don’t allow online changes to your name, Social Security number,
              date of birth, or gender. If you need to change this information,
              at <va-telephone contact="8008271000" /> (
              <va-telephone contact={CONTACTS[711]} tty />
              ). We’re here Monday through Friday, between 8:00 a.m. and 9:00
              p.m. ET. We’ll give you instructions for how to change your
              information. Or you can learn how to change your legal name on
              file with VA.{' '}
              <va-link
                external
                text="Learn how to change your legal name (opens in new tab)"
                href="/resources/how-to-change-your-legal-name-on-file-with-va/"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UneditableData;
