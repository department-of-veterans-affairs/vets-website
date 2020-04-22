import React from 'react';
import PropTypes from 'prop-types';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { links } from 'applications/caregivers/definitions/content';

export const VetInfo = () => (
  <p>Please complete all of the following information</p>
);

export const PrimaryCaregiverInfo = ({ additionalInfo }) => (
  <div>
    <p>
      Complete the following information about the Caregiver or Family member
      who is helping the Veteran or Service member. You can also include
      information about up to two Secondary Family Caregivers.
    </p>

    {additionalInfo && (
      <section>
        <AdditionalInfo triggerText="What is a primary family caregiver">
          <p>
            A Family Member (defined herein), who is designated as a "primary
            provider of personal care services" under
            <a
              href={links.caregiverDefinition.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links.caregiverDefinition.label}
            </a>
            and who meets the requirements of
            <a
              href={links.familyCaregiver.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links.familyCaregiver.label}
            </a>
          </p>
          <a
            href={links.caregiverBenefits.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {links.caregiverBenefits.label}
          </a>
        </AdditionalInfo>
      </section>
    )}
  </div>
);

PrimaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
};

PrimaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
};

export const SecondaryCaregiverInfo = () => (
  <p>
    Complete the following information about the Secondary Caregiver or Family
    member who is helping the Veteran or Service member. You can include
    information about up to two Secondary Family Caregivers.
  </p>
);

export const FacilityInfo = () => (
  <>
    <div className="vads-u-margin-bottom--4">
      <AdditionalInfo triggerText="Can&apos;t find your clinic">
        We only include certain facilities. You should pick the medical center
        or clinic closest to your home.
      </AdditionalInfo>
    </div>

    <a
      href={links.findLocations.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      {links.findLocations.label}
    </a>
  </>
);

export const PrimaryHealthCoverage = () => (
  <>
    <div className="vads-u-margin-bottom--4">
      <p>Check all that the primary caregiver is currently enrolled in</p>
      <div className="vads-u-margin-top--2">
        <AdditionalInfo triggerText="Learn more about health coverage">
          <p>
            <b>Medicaid</b> is a government health program for eligible
            low-income individuals and families and people with disabilities.
          </p>

          <p>
            <b>Medicare</b> is a federal health insurance program providing
            coverage for people who are 65 years or older or who meet who meet
            special criteria. Part A insurance covers hospital care, skilled
            nursing and nursing home care, hospice, and home health services.
          </p>

          <p>
            <b>Tricare</b> is a cost-sharing program that covers the price of
            some health care services and supplies
          </p>
        </AdditionalInfo>
      </div>
    </div>
  </>
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
