import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { InfoSection } from '../../../shared/components/InfoSection';
import { maskSSN } from '../../../utils/helpers/general';

const AdditionalInfoContent = () => {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        To protect your personal information, we don’t allow online changes to
        your name, date of birth, or Social Security number. If you need to
        change this information, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
        We’ll give you instructions for how to change your information.
      </p>

      <p className="vads-u-margin-bottom--0">
        Or you can learn how to change your legal name on file with VA.{' '}
        <va-link
          text="Learn how to change your legal name (opens in new tab)"
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
        />
      </p>
    </div>
  );
};

const UneditableData = () => {
  const name = 'Rita Ann Jackson';
  const dob = 'April 7, 1958';
  const gender = 'Female';
  const veteranSsn = '123906784';
  const maskedSsn = maskSSN(veteranSsn);

  return (
    <div id="uneditable-data">
      <h2 className="vads-u-margin-top--9">Uneditable data</h2>

      {/* 1st Option */}
      <div className="vads-u-margin-bottom--3">
        <p className="vads-u-font-size--md vads-u-margin-top--4">
          Confirm your information before you continue.
        </p>
        <InfoSection title="Applicant information" titleLevel={3}>
          <dl>
            <InfoSection.InfoBlock label="First name" value="Rita" />
            <InfoSection.InfoBlock label="Middle name" value="Ann" />
            <InfoSection.InfoBlock label="Last name" value="Jackson" />
            <InfoSection.InfoBlock label="Suffix" value="None provided" />
            <InfoSection.InfoBlock
              label="Social Security number"
              value={maskedSsn}
            />
            <InfoSection.InfoBlock label="Date of birth" value={dob} />
            <InfoSection.InfoBlock label="Gender" value={gender} />
          </dl>
        </InfoSection>
      </div>

      <va-additional-info
        trigger="How to change this information"
        class="vads-u-padding-bottom--9"
      >
        <AdditionalInfoContent />
      </va-additional-info>

      {/* 2nd Option */}
      <div className="vads-u-margin-top--9 vads-u-border-top--2px">
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
            don’t allow online changes to your name, date of birth, or Social
            Security number. If you need to change this information, call us at{' '}
            <va-telephone contact="8008271000" /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
            ET. We’ll give you instructions for how to change your information.
            Or you can learn how to change your legal name on file with VA.{' '}
            <va-link
              text="Learn how to change your legal name (opens in new tab)"
              href="/resources/how-to-change-your-legal-name-on-file-with-va/"
            />
          </p>
        </div>
      </div>

      {/* 3rd Option */}
      <div className="vads-u-margin-top--9 vads-u-border-top--2px">
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

        <div>
          <p className="vads-u-margin-top--4">
            <strong>Note:</strong> To protect your personal information, we
            don’t allow online changes to your name, date of birth, or Social
            Security number. If you need to change this information, call us at{' '}
            <va-telephone contact="8008271000" /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
            ET. We’ll give you instructions for how to change your information.
            Or you can learn how to change your legal name on file with VA.{' '}
            <va-link
              text="Learn how to change your legal name (opens in new tab)"
              href="/resources/how-to-change-your-legal-name-on-file-with-va/"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default UneditableData;
