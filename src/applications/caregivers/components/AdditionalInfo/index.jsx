import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const InjuredLineOfDutyInto = () => (
  <AdditionalInfo triggerText="Learn more about injured in the Line of Duty">
    An injury incurred or aggravated during active military service, unless the
    injury resulted from the Veteran's or Servicemember's willful misconduct or
    abuse of alcohol or drugs, or it occurred while that individual was avoiding
    duty by desertion, or absent without leave which materially interfered with
    the performance of military duty.
  </AdditionalInfo>
);

export const PrimaryCaregiverInfo = () => (
  <AdditionalInfo triggerText="What is a primary family caregiver">
    <p>
      A Family Member (defined herein), who is designated as a "primary provider
      of personal care services" under
      <a
        href="https://www.law.cornell.edu/uscode/text/38/1720G"
        target="_blank"
        rel="noopener noreferrer"
      >
        38 U.S.C. §1720G(a)(7)(A);
      </a>
      and who meets the requirements of
      <a
        href="https://www.law.cornell.edu/cfr/text/38/71.25"
        target="_blank"
        rel="noopener noreferrer"
      >
        38 C.F.R. §71.25.
      </a>
    </p>
    <a
      href="https://www.va.gov/healthbenefits/resources/Caregiver_Eligibility_Check.asp"
      target="_blank"
      rel="noopener noreferrer"
    >
      Find out if you qualify
    </a>
  </AdditionalInfo>
);

export const SecondaryCaregiverInfo = () => (
  <AdditionalInfo triggerText="What is a secondary family caregiver">
    <p>
      An individual approved as a "provider of personal care services" for the
      eligible Veteran under{' '}
      <a
        href="https://www.law.cornell.edu/uscode/text/38/1720G"
        target="_blank"
        rel="noopener noreferrer"
      >
        38 U.S.C. §1720G(a)(7)(A);
      </a>
      meets the requirements of{' '}
      <a
        href="https://www.law.cornell.edu/cfr/text/38/71.25"
        target="_blank"
        rel="noopener noreferrer"
      >
        38 C.F.R. §71.25;
      </a>
      and generally serves as a back-up to the Primary Family Caregiver.
    </p>
    <a
      href="https://www.va.gov/healthbenefits/resources/Caregiver_Eligibility_Check.asp"
      target="_blank"
      rel="noopener noreferrer"
    >
      Find out if you qualify
    </a>
  </AdditionalInfo>
);

export const CHAMPVAInfo = () => (
  <AdditionalInfo triggerText="Learn more about CHAMPVA">
    <p>
      CHAMPVA is a cost-sharing program that covers the price of some health
      care services and supplies.
    </p>
    <a
      href="https://www.va.gov/health-care/family-caregiver-benefits/champva/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more about CHAMPVA
    </a>
  </AdditionalInfo>
);

export const CaregiverSupportInfo = () => (
  <AdditionalInfo triggerText="What is a caregiver support coordinator?">
    Caregiver Support Coordinators (CSC) connect caregivers with VA and
    community resources. They are located at every VA medical center and
    specialize in caregiving issues.
    <a
      href="https://www.caregiver.va.gov/support/New_CSC_Page.asp"
      target="_blank"
      rel="noopener noreferrer"
    >
      Find a caregiver support coordinator near you.
    </a>
  </AdditionalInfo>
);

export const PowerOfAttorneyInfo = () => (
  <AdditionalInfo triggerText="What is power of attorney?">
    Power of attorney authorizes someone to act on the behalf of a Veteran or
    service member when completing this form.
  </AdditionalInfo>
);

export const RepresentativeInfo = () => (
  <AdditionalInfo triggerText="Who can be a representative?">
    Refers to a Veteran's or Servicemember's court-appointed legal guardian or
    special guardian Durable POA for Health Care, or other designated health
    care agent. Attach POA/Representation documents to the application if
    applicable.
    <span>You can also:</span>
    <ol>
      <li>Call us at 877-222-VETS (877-222-8387)</li>
      <li>
        Find a{' '}
        <a
          href="https://www.caregiver.va.gov/support/New_CSC_Page.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Caregiver Support Coordinator
        </a>
      </li>
      <li>Contact the National Caregiver Support line at 855-260-3274</li>
      <li>Contact a Veterans Service Orginazation</li>
    </ol>
  </AdditionalInfo>
);
