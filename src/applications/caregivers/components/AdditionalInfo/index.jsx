import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { links } from 'applications/caregivers/definitions/content';

export const InjuredLineOfDutyInto = () => (
  <AdditionalInfo triggerText="Learn more about injured in the Line of Duty">
    An injury incurred or aggravated during active military service, unless the
    injury resulted from the Veteran&apos;s or Service member&apos;s willful
    misconduct or abuse of alcohol or drugs, or it occurred while that
    individual was avoiding duty by desertion, or absent without leave which
    materially interfered with the performance of military duty.
  </AdditionalInfo>
);

export const SecondaryCaregiverInfo = () => (
  <AdditionalInfo triggerText="What is a secondary family caregiver">
    <p>
      An individual approved as a "provider of personal care services" for the
      eligible Veteran under{' '}
      <a
        href={links.caregiverDefinition.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {links.caregiverDefinition.label}
      </a>
      meets the requirements of{' '}
      <a
        href={links.caregiverEligibility.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {links.caregiverEligibility.label}
      </a>
      and generally serves as a back-up to the Primary Family Caregiver.
    </p>
    <a
      href={links.caregiverBenefits.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {links.caregiverBenefits.label}
    </a>
  </AdditionalInfo>
);

export const CHAMPVAInfo = () => (
  <AdditionalInfo triggerText="Learn more about CHAMPVA">
    <p>
      CHAMPVA is a cost-sharing program that covers the price of some health
      care services and supplies.
    </p>
    <a href={links.CHAMPVAInfo.link} target="_blank" rel="noopener noreferrer">
      {links.CHAMPVAInfo.label}
    </a>
  </AdditionalInfo>
);

export const CaregiverSupportInfo = () => (
  <AdditionalInfo triggerText="What is a caregiver support coordinator?">
    Caregiver Support Coordinators (CSC) connect caregivers with VA and
    community resources. They are located at every VA medical center and
    specialize in caregiving issues.
    <a
      href={links.caregiverSupportCoordinators.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {links.caregiverSupportCoordinators.label}
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
    Refers to a Veteran&apos;s or Service member&apos;s court-appointed legal
    guardian or special guardian Durable POA for Health Care, or other
    designated health care agent. Attach POA/Representation documents to the
    application if applicable.
    <span>You can also:</span>
    <ol>
      <li>Call us at 877-222-VETS (877-222-8387)</li>
      <li>
        Find a{' '}
        <a
          href={links.caregiverSupportCoordinators.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {links.caregiverSupportCoordinators.label}
        </a>
      </li>
      <li>Contact the National Caregiver Support line at 855-260-3274</li>
      <li>Contact a Veterans Service Orginazation</li>
    </ol>
  </AdditionalInfo>
);
