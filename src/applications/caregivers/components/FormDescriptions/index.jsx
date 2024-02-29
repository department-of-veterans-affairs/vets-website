import React from 'react';
import { links } from '../../definitions/content';

export const AdditionalCaregiverDescription = (
  <>
    <strong>You can add up to two Secondary Family Caregivers.</strong>
    <p>
      Would you like to apply for benefits for another Secondary Family
      Caregiver?
    </p>
  </>
);

export const EmailEncouragementDescription = (
  <div className="vads-u-margin-top--4 vads-u-margin-bottom--2p5">
    <strong>Note:</strong> Including an email address on your application is
    optional, but it helps us contact you faster if we need to follow up with
    you. If you don’t include an email address, we’ll use your phone and address
    to contact you. We’ll always mail you a copy of our decision on your
    application.
  </div>
);

export const FacilityInfoDescription = (
  <div className="vads-u-margin-top--2p5">
    <p className="vads-u-margin-bottom--4">
      <strong>Note:</strong> You should choose the medical center or clinic
      closest to your home.
    </p>

    <a
      href={links.findLocations.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      {links.findLocations.label}
    </a>
  </div>
);

export const HeathCareCoverageDescription = (
  <va-additional-info
    trigger="Why we ask this information"
    class="vads-u-margin-y--2p5"
    uswds
  >
    <p className="vads-u-margin-top--0">
      This information helps us determine if you may be eligible for health care
      coverage through VA.
    </p>
    <p>
      You may be eligible for The Civilian Health and Medical Program of the
      Department of Veteran’s Affairs (CHAMPVA) if both of these descriptions
      are true for you:
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

    <p className="vads-u-margin-bottom--0">
      <strong>Note:</strong> This information doesn’t affect your eligibility
      for the Caregiver Support Program. We only use it to determine if you may
      be eligible for health care.
    </p>
  </va-additional-info>
);

export const LastTreatmentFacilityDescription = (
  <>
    <p>
      Please enter the name of the medical facility where the Veteran{' '}
      <strong>last received medical treatment.</strong>
    </p>
  </>
);

export const PreferredFacilityDescription = (
  <>
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
  </>
);

export const PreferredFacilityAPIDescription = (
  <>
    <p>
      Select the facility where the Veteran gets or plans to get their care.
      <span className="vads-u-color--secondary-darkest">(*Required)</span>
    </p>
    <p>
      <strong>Note:</strong> We use the location of the Veteran’s health care
      facility to find the nearest facility that processes applications. Only
      some facilities process caregiver program applications.
    </p>
  </>
);

export const RepresentativeDescription = (
  <>
    <h3 className="vads-u-font-size--h4">
      We’ll now guide you through the steps to review and sign your application
    </h3>
    <p>
      First, we need to know if the Veteran will sign the application or if a
      representative will sign for them.
    </p>
    <p>
      A representative must have legal authority to make decisions for the
      Veteran. If you choose this option, we’ll ask you to upload a document
      that proves you have this authority.
    </p>

    <va-additional-info
      trigger="Learn more about the types of documents we can and can’t accept"
      uswds
    >
      We can only accept a document that proves you have legal authority to make
      decisions for the Veteran (such as a valid Power of Attorney, legal
      guardianship order, or other legal document). We can’t accept a marriage
      certificate, driver’s license, or release of information form. Uploading a
      document that we can’t accept may delay the application process.
    </va-additional-info>

    <p className="vads-u-margin-y--4">
      <strong>Note:</strong> We use this signature only to process your
      application. Signing for the Veteran today doesn’t take away their right
      to make decisions for their care.
    </p>
  </>
);

export const RepresentativeDocumentsDescription = (
  <>
    <h3 className="vads-u-font-size--h4">Upload your supporting document</h3>

    <p>
      We can only accept a document that proves you have legal authority to make
      medical decisions for the Veteran.
    </p>

    <p>
      <strong>Don’t have the right type of document?</strong> Go back to the
      last screen. The Veteran will need to sign the application for themselves.
    </p>

    <h4 className="vads-u-font-size--h5">How to upload your document</h4>

    <ul className="vads-u-margin-top--1px vads-u-margin-bottom--3">
      <li>
        Choose a document that we can accept (such as a valid Power of Attorney,
        legal guardianship order, or other legal document). Don’t upload a
        marriage certificate, driver’s license, or release of information form.
        Uploading a document that we can’t accept may delay the application
        process.
      </li>
      <li>
        Save a scanned copy or photo of the entire document on your device. We
        can’t accept a cover or signature page without the rest of the document.
      </li>
      <li>
        Format the file as a .pdf, .jpg, .jpeg, or .png. Be sure the file is
        10MB or less in size.
      </li>
    </ul>
  </>
);

export const VeteranSSNDescription = (
  <va-additional-info
    trigger="Why is this required?"
    class="vads-u-margin-y--1p5"
    uswds
  >
    We need the Veteran’s Social Security number or tax identification number to
    process the application when it’s submitted online, but it’s not a
    requirement to apply for the program.
  </va-additional-info>
);

export const VeteranFullNameDescription = (
  <>
    <span className="vads-u-display--block vads-u-color--gray-medium">
      Enter the name on the Veteran’s government-issued ID, like a driver’s
      license or passport
    </span>
  </>
);
export const CaregiverFullNameDescription = (
  <>
    <span className="vads-u-display--block vads-u-color--gray-medium">
      Enter the name on the Caregiver’s government-issued ID, like a driver’s
      license or passport
    </span>
  </>
);

export const VeteranHomeAddressDescription = (
  <>
    <span className="vads-u-display--block vads-u-color--gray-medium">
      This is the address where the Veteran lives
    </span>
  </>
);
