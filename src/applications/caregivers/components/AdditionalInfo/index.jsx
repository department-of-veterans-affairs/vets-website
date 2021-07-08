import React from 'react';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import environment from 'platform/utilities/environment';

import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
} from 'applications/caregivers/definitions/constants';
import { links } from 'applications/caregivers/definitions/content';
import { arrayToSentenceString } from '../../helpers';

export const VeteranSSNInfo = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="Why is this required?">
      We need the Veteran’s Social Security number or tax identification number
      to process the application when it’s submitted online, but it’s not a
      requirement to apply for the program.
    </AdditionalInfo>
  </div>
);

export const VetInfo = ({ pageTitle, headerInfo }) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}

    {headerInfo && (
      <p className="vads-u-margin-top--2">
        Please complete all the following information.
      </p>
    )}
  </>
);

VetInfo.propTypes = {
  pageTitle: PropTypes.string,
};

export const PrimaryCaregiverInfo = ({
  additionalInfo,
  pageTitle,
  headerInfo,
}) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}
    {headerInfo && (
      <p className="vads-u-margin-top--2">
        Please complete the following information about the Primary Family
        Caregiver.
      </p>
    )}

    {additionalInfo && (
      <section className="vads-u-margin-y--2p5">
        <AdditionalInfo triggerText="Learn more about who qualifies as a Primary Family Caregiver">
          <p>
            Family caregivers are approved and designated by VA as Primary
            Family Caregivers and Secondary Family Caregivers to provide
            personal care services. A Primary Family Caregiver is the main
            caregiver for the eligible Veteran.
          </p>

          <>
            <p>They can be the Veteran&apos;s:</p>

            <ul>
              <li>Parent</li>
              <li>Spouse</li>
              <li>Son or daughter</li>
              <li>Stepfamily member</li>
              <li>Grandchild</li>
              <li>Significant other</li>
              <li>Friend or neighbor</li>
              <li>Other relative</li>
            </ul>
          </>
        </AdditionalInfo>
      </section>
    )}
  </>
);

PrimaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
  pageTitle: PropTypes.string,
  headerInfo: PropTypes.bool,
};

PrimaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
  headerInfo: true,
};

export const SecondaryCaregiverLegal = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="Learn more about who qualifies as a Secondary Family Caregiver">
      <p>
        Family caregivers are approved and designated by VA as Primary Family
        Caregivers and Secondary Family Caregivers to provide personal care
        services. A Secondary Family Caregiver generally serves as a backup to
        the Primary Family Caregiver.
      </p>

      <>
        <p>They can be the Veteran&apos;s:</p>

        <ul>
          <li>Parent</li>
          <li>Spouse</li>
          <li>Son or daughter</li>
          <li>Stepfamily member</li>
          <li>Grandchild</li>
          <li>Significant other</li>
          <li>Friend or neighbor</li>
          <li>Other relative</li>
        </ul>
      </>
    </AdditionalInfo>
  </div>
);

export const SecondaryCaregiverInfo = ({
  pageTitle,
  additionalInfo,
  headerInfo,
}) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}
    {headerInfo && <p className="vads-u-margin-top--2"> {headerInfo} </p>}
    {additionalInfo && <SecondaryCaregiverLegal />}
  </>
);

SecondaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
  pageTitle: PropTypes.string,
  headerInfo: PropTypes.string,
};

export const FacilityInfo = () => (
  <div className="vads-u-margin-top--2p5">
    <div className="vads-u-margin-bottom--4">
      <strong>Note:</strong> You should choose the medical center or clinic
      closest to your home.
    </div>

    <a
      href={links.findLocations.link}
      rel="noopener noreferrer"
      target="_blank"
      className="vads-u-margin-x--0p5"
    >
      {links.findLocations.label}
    </a>
  </div>
);

export const CaregiverSupportInfo = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="What&apos;s a Caregiver Support Coordinator ?">
      A Caregiver Support Coordinator is a clinical professional who connects
      Veteran caregivers with VA and community resources that offer supportive
      programs and services. Caregiver Support Coordinators are located at every
      VA medical center and specialize in caregiving issues.
    </AdditionalInfo>
  </div>
);

export const PrimaryHealthCoverage = ({ pageTitle }) => (
  <>{pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}</>
);

export const PleaseSelectVAFacility = () => (
  <section>
    <h3 className="vads-u-font-size--h4">VA health care services</h3>

    <p>
      Please select the VA medical center or clinic where the
      <strong className="vads-u-margin-left--0p5">
        Veteran receives or plans to receive health care services.
      </strong>
    </p>

    <p>
      A Caregiver Support Coordinator at this VA medical center will review your
      application.
    </p>
  </section>
);

export const AdditionalCaregiverInfo = () => (
  <>
    <strong>You can add up to 2 Secondary Family Caregivers.</strong>
    <p>
      Would you like to apply for benefits for another Secondary Family
      Caregiver?
    </p>
  </>
);

export const SecondaryRequiredAlert = () => {
  return (
    <AlertBox
      headline="We need you to add a Family Caregiver"
      content="We can’t process your application unless you add a Family Caregiver. Please go back and add either a Primary or Secondary Family Caregiver to your application."
      status={ALERT_TYPE.ERROR}
      isVisible
    />
  );
};

export const RepresentativeIntroContent = () => {
  return (
    <section>
      <p>
        Some family caregivers are also the Veteran’s legal representative.
        These representatives have the legal authority to make certain decisions
        for the Veteran.
      </p>

      <p>Here's what you should know:</p>

      <ul>
        <li>
          You can still continue with this application to apply for the program
          even if you’re not the Veteran’s legal representative.
        </li>

        <li>
          If you are the Veteran’s legal representative, you can upload a
          document to show your legal status now. If you don't upload your
          document now, we'll ask you to provide it later.
        </li>
      </ul>
    </section>
  );
};

export const RepresentativeAdditionalInfo = () => {
  return environment.isProduction() ? (
    <div className="vads-u-margin-top--1">
      <AdditionalInfo triggerText="What type of document does a legal representative need?">
        <p>
          To show that you’re the Veteran’s legal representative, you’ll need to
          upload one of these current documents:
        </p>

        <ul>
          <li>
            Power of attorney,
            <strong className="vads-u-margin-left--0p5">or</strong>
          </li>

          <li>
            Legal guardianship order,
            <strong className="vads-u-margin-left--0p5">or</strong>
          </li>

          <li>
            Another legal document that confirms your legal status as the
            Veteran’s representative. This document can be from a federal,
            state, local, or tribal court.
          </li>
        </ul>

        <p className="vads-u-margin-top--4">
          <strong>Note:</strong> Being a Veteran’s closest family member or next
          of kin doesn’t mean you’re their representative. You need a separate
          legal document to show your status as the representative.
        </p>
      </AdditionalInfo>
    </div>
  ) : (
    <div className="vads-u-margin-top--1">
      <AdditionalInfo triggerText="What types of documents does VA accept to show legal representation?">
        <p>
          First, please know that we only accept <strong>full documents</strong>
          . We can't accept only a cover or signature page. Our staff will
          review the documents during the application process.
        </p>

        <p className="vads-u-margin-top--4">We accept these documents:</p>
        <ul>
          <li>
            Veteran guardianship,
            <strong className="vads-u-margin-left--0p5">or</strong>
          </li>
          <li>Veteran-related court order</li>
        </ul>

        <p className="vads-u-margin-top--4">
          We may accept these documents, depending on the requirements where you
          live:
        </p>
        <ul>
          <li>
            Power of attorney for the Veteran,
            <strong className="vads-u-margin-left--0p5">or</strong>
          </li>
          <li>Health care power of attorney for the Veteran</li>
        </ul>

        <p className="vads-u-margin-top--4">
          Being a Veteran’s close family member or next of kin doesn’t mean
          you’re their representative. We don't accept these documents as a way
          to show legal representation:
        </p>
        <ul>
          <li>Marriage or driver's licenses</li>
          <li>Release of Information forms or fiduciary program documents</li>
          <li>Medical or VA benefit records</li>
          <li>Health insurance information</li>
        </ul>
      </AdditionalInfo>
    </div>
  );
};

export const RepresentativeDocumentUploadDescription = () => {
  const prependDot = string => `.${string}`;
  const allowedFileTypes = arrayToSentenceString(
    ALLOWED_FILE_TYPES,
    'or',
    prependDot,
  );

  return environment.isProduction() ? (
    <section>
      <p>
        You’ll need to scan your document onto the device you’re using to submit
        this application, such as your computer, tablet, or mobile phone. You
        can upload your document from there.
      </p>

      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>You can upload a {allowedFileTypes} file</li>
        <li>
          Your file should be no larger than {MAX_FILE_SIZE_MB}
          MB
        </li>
      </ul>

      <p>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow internet connection.
      </p>

      <RepresentativeAdditionalInfo />
    </section>
  ) : (
    <section>
      <p>
        You can upload a scanned copy or photo of your document from the device
        you’re using to apply online.
      </p>

      <p>Follow these guidelines when you upload your document:</p>
      <ul>
        <li>
          Upload the full document. We can’t accept only a cover or signature
          page.
        </li>
        <li>Format the file as a {allowedFileTypes}.</li>
        <li>
          Be sure the file is {MAX_FILE_SIZE_MB}
          MB or less in size.
        </li>
      </ul>

      <p>
        <strong>Note: </strong>A 1MB scanned file equals about 500 pages of
        text. A photo is usually about 6MB. If you have a slow Internet
        connection, large files may take longer to upload.
      </p>

      <RepresentativeAdditionalInfo />
    </section>
  );
};
