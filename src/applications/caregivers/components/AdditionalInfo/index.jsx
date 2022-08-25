import React, { useEffect, useRef } from 'react';

import { focusElement } from 'platform/utilities/ui';
import { links } from 'applications/caregivers/definitions/content';

export const VeteranSSNInfo = () => (
  <div className="vads-u-margin-y--1p5">
    <va-additional-info trigger="Why is this required?">
      We need the Veteran’s Social Security number or tax identification number
      to process the application when it’s submitted online, but it’s not a
      requirement to apply for the program.
    </va-additional-info>
  </div>
);

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
    <va-additional-info trigger="What&apos;s a Caregiver Support Coordinator ?">
      A Caregiver Support Coordinator is a clinical professional who connects
      Veteran caregivers with VA and community resources that offer supportive
      programs and services. Caregiver Support Coordinators are located at every
      VA medical center and specialize in caregiving issues.
    </va-additional-info>
  </div>
);

export const whyAskHealthCareCoverage = () => (
  <div className="vads-u-margin-y--2p5">
    <va-additional-info trigger="Why we ask this information">
      <div className="vads-u-margin-bottom--5">
        <p>
          This information helps us determine if you may be eligible for health
          care coverage through VA.
        </p>
        <p>
          You may be eligible for The Civilian Health and Medical Program of the
          Department of Veteran’s Affairs (CHAMPVA) if both of these
          descriptions are true for you:
        </p>
        <ul>
          <li>
            You’re the Primary Family Caregiver of a Veteran with a
            service-connected disability, <strong>and</strong>
          </li>
          <li>
            You don’t have any other health care coverage, such as Medicaid,
            Medicare, CHAMPVA, Tricare, or private insurance.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> This information doesn’t affect your
          eligibility for the Caregiver Support Program. We only use it to
          determine if you may be eligible for health care.
        </p>
      </div>
    </va-additional-info>
  </div>
);

export const PleaseSelectVAFacility = () => (
  <section>
    <h3 className="vads-u-font-size--h4">VA health care services</h3>

    <p>
      Please select the VA medical center or clinic where the{' '}
      <strong>
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

export const SecondaryRequiredAlert = () => (
  <va-alert status="error">
    <h3 slot="headline">We need you to add a Family Caregiver</h3>
    <p className="vads-u-font-size--base">
      We can’t process your application unless you add a Family Caregiver.
      Please go back and add either a Primary or Secondary Family Caregiver to
      your application.
    </p>
  </va-alert>
);

export const RepresentativeIntroContent = () => {
  return (
    <section>
      <h3 className="vads-u-font-size--h4">
        We’ll now guide you through the steps to review and sign your
        application
      </h3>
      <p>
        First, we need to know if the Veteran will sign the application or if a
        representative will sign for them.
      </p>
      <p>
        A representative must have legal authority to make medical decisions for
        the Veteran. If you choose this option, we’ll ask you to upload a
        document that proves you have this authority.
      </p>
      <va-additional-info trigger="Learn more about the types of documents we can and can’t accept">
        <p>
          We can only accept a document that proves you have legal authority to
          make medical decisions for the Veteran. This type of document is
          sometimes called a medical proxy or medical power of attorney.
        </p>
        <p>
          We can’t accept a marriage certificate, driver’s license, or release
          of information form. We also can’t accept a general or financial power
          of attorney without a medical stipulation. Uploading a document that
          we can’t accept may delay the application process.
        </p>
      </va-additional-info>
      <p>
        <strong>Note:</strong> We use this signature only to process your
        application. Signing for the Veteran today doesn’t take away their right
        to make decisions for their care.
      </p>
      <br />
    </section>
  );
};

export const RepresentativeAdditionalInfo = () => {
  return (
    <div className="vads-u-margin-top--1">
      <va-additional-info trigger="What types of documents does VA accept to show legal representation?">
        <p>
          First, please know that we only accept <strong>full documents</strong>
          . We can’t accept only a cover or signature page. Our staff will
          review the documents during the application process.
        </p>

        <p className="vads-u-margin-top--4">We accept these documents:</p>
        <ul>
          <li>
            Veteran guardianship, <strong>or</strong>
          </li>
          <li>Veteran-related court order</li>
        </ul>

        <p className="vads-u-margin-top--4">
          We may accept these documents, depending on the requirements where you
          live:
        </p>
        <ul>
          <li>
            Power of attorney for the Veteran, <strong>or</strong>
          </li>
          <li>Health care power of attorney for the Veteran</li>
        </ul>

        <p className="vads-u-margin-top--4">
          Being a Veteran’s close family member or next of kin doesn’t mean
          you’re their representative. We don’t accept these documents as a way
          to show legal representation:
        </p>
        <ul>
          <li>Marriage or driver’s licenses</li>
          <li>Release of Information forms or fiduciary program documents</li>
          <li>Medical or VA benefit records</li>
          <li>Health insurance information</li>
        </ul>
      </va-additional-info>
    </div>
  );
};

export const UploadSuccessAlertDescription = () => {
  const divElement = useRef();
  useEffect(() => {
    focusElement(divElement.current);
  }, []);
  return (
    <div
      id="upload-success-alert"
      ref={divElement}
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--gibill-accent vads-u-margin-y--2 vads-u-margin-right--neg9 vads-u-padding-y--0p25 vads-u-padding-x--2p5"
      style={{ outline: 'none' }}
    >
      <p className="vads-u-font-family--serif vads-u-font-size--md vads-u-margin-bottom--1px">
        <strong>Check your upload before you continue</strong>
      </p>
      <p className="vads-u-margin-top--1px">
        It’s easy to upload the wrong file by mistake. We want to make sure that
        we review the right document (like a medical proxy or medical power of
        attorney). This will help speed up your application process.
      </p>
      <p>
        Check the file name. If it’s not the right file, you can delete it and
        upload another one before you continue.
      </p>
    </div>
  );
};

export const RepresentativeDocumentUploadDescription = () => {
  return (
    <section className="vads-u-margin-bottom--3">
      <h3 className="vads-u-font-size--h3">Upload your supporting document</h3>
      <p>
        We can only accept a document that proves you have legal authority to
        make medical decisions for the Veteran. This type of document is
        sometimes called a medical proxy or medical power of attorney.
      </p>
      <p>
        <strong>Don’t have the right type of document?</strong> Go back to the
        last screen. The Veteran will need to sign the application for
        themselves.
      </p>
      <p className="vads-u-font-family--serif vads-u-font-size--md vads-u-margin-bottom--1px">
        <strong>How to upload your document</strong>
      </p>
      <ul className="vads-u-margin-top--1px">
        <li>
          Choose a document that we can accept (like a medical proxy or medical
          power of attorney). Don’t upload a marriage certificate, driver’s
          license, or release of information form. And don’t upload a general or
          financial power of attorney without a medical stipulation. Uploading a
          document that we can’t accept may delay the application process.
        </li>
        <li>
          Save a scanned copy or photo of the entire document on your device. We
          can’t accept a cover or signature page without the rest of the
          document.
        </li>
        <li>
          Format the file as a .pdf, .jpg, .jpeg, or .png. Be sure the file is
          10MB or less in size.
        </li>
      </ul>
    </section>
  );
};

export const CaregiversPrivacyActStatement = () => (
  <>
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
      Privacy Act Statement
    </h2>
    <p>
      <strong>The Paperwork Reduction Act:</strong> This information collection
      is in accordance with the clearance requirements of section 3507 of the
      Paperwork Reduction Act of 1995. Public reporting burden for this
      collection of information is estimated to average 15 minutes per response,
      including the time to read instructions, gather necessary data, and fill
      out the form. Respondents should be aware that notwithstanding any other
      provision of law, no person shall be subject to any penalty for failing to
      comply with a collection of information if it does not display a currently
      valid OMB control number. Completion of this form is mandatory for
      individuals who wish to participate in the Program of Comprehensive
      Assistance for Family Caregivers.
    </p>
    <p>
      <strong>Privacy Act information:</strong> VA is asking you to provide the
      information on this form under 38 U.S.C. Sections 101, 5303A, 1705, 1710,
      1720B, 1720G, 1725 and 1781 in order for VA to determine your eligibility
      for medical benefits. Information you supply may be verified through a
      computer-matching program. VA may disclose the information that you put on
      the form as permitted by law. VA may make a "routine use" disclosure of
      the information as outlined in the Privacy Act systems of records,
      “Patient Medical Records --VA” (24VA10P2), “Enrollment and Eligibility
      Records --VA” (147VA10NF1), and “Veterans and Beneficiaries Purchased Care
      Community Health Care Claims, Correspondence, Eligibility, Inquiry and
      Payment Files - VA” (54VA10NB3) and in accordance with the VHA Notice of
      Privacy Practices. Providing the requested information, including Social
      Security Number, is voluntary, but if any or all of the requested
      information is not provided, it may delay or result in denial of your
      request for health care benefits. Failure to furnish the information will
      not have any effect on any other benefits to which you may be entitled. If
      you provide VA your Social Security Number, VA will use it to administer
      your VA benefits. VA may also use this information to identify Veterans
      and persons claiming or receiving VA benefits, and their records, and for
      other purposes authorized or required by law.
    </p>
  </>
);
