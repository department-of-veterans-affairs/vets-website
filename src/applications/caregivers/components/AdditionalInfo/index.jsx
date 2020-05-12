import React from 'react';
import PropTypes from 'prop-types';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { links } from 'applications/caregivers/definitions/content';

export const VetInfo = ({ pageTitle }) => (
  <>
    {pageTitle && <h5 className="vads-u-font-size--h4">{pageTitle}</h5>}
    <p className="vads-u-margin-top--2">
      Please complete all of the following information
    </p>
  </>
);

VetInfo.propTypes = {
  pageTitle: PropTypes.string,
};

export const LearnMoreSecondaryCaregiver = () => <></>;

export const PrimaryCaregiverInfo = ({ additionalInfo, pageTitle }) => (
  <>
    {pageTitle && <h5 className="vads-u-font-size--h4">{pageTitle}</h5>}
    <p className="vads-u-margin-top--2">
      Please complete the following information about the Primary Family
      Caregiver.
    </p>

    {additionalInfo && (
      <section className="vads-u-margin-y--2p5">
        <AdditionalInfo triggerText="What's a Primary Family Caregiver?">
          <p>
            A Family Member (defined herein), who is designated as a "primary
            provider of personal care services" under
            <a
              href={links.caregiverDefinition.link}
              target="_blank"
              rel="noopener noreferrer"
              className="vads-u-margin-x--0p5"
            >
              {links.caregiverDefinition.label}
            </a>
            and who meets the requirements of
            <a
              href={links.familyCaregiver.link}
              target="_blank"
              rel="noopener noreferrer"
              className="vads-u-margin-x--0p5"
            >
              {links.familyCaregiver.label}
            </a>
          </p>
          <>
            <p>
              For the purpose of the program, Primary Family Caregivers are
              people designated as a primary provider of personal care services
              to a Veteran. They can be the Veteran’s or service member’s:
            </p>

            <ul>
              <li>Parent</li>
              <li>Spouse</li>
              <li>Son or daughter</li>
              <li>Step-family member</li>
              <li>Extended family member</li>
              <li>
                Someone who is not a family member but resides with the Veteran
                or will do so upon approval
              </li>
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
};

PrimaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
};

export const SecondaryCaregiverLegal = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="Learn more about Secondary Family Caregiver">
      <p>
        An individual approved as a "provider of personal care services" for the
        eligible Veteran under
        <a
          href={links.caregiverDefinition.link}
          target="_blank"
          rel="noopener noreferrer"
          className="vads-u-margin-x--0p5"
        >
          {links.caregiverDefinition.label}
        </a>
        meets the requirements of
        <a
          href={links.familyCaregiver.link}
          target="_blank"
          rel="noopener noreferrer"
          className="vads-u-margin-x--0p5"
        >
          {links.familyCaregiver.label}
        </a>
        and generally serves as a back-up to the Primary Family Caregiver.
      </p>

      <>
        <p>
          Secondary Family Caregivers can be the Veteran’s or service member’s:
        </p>

        <ul>
          <li>Parent</li>
          <li>Spouse</li>
          <li>Son or daughter</li>
          <li>Step-family member</li>
          <li>Extended family member</li>
          <li>
            Someone who is not a family member but resides with the Veteran or
            will do so upon approval
          </li>
        </ul>
      </>
    </AdditionalInfo>
  </div>
);

export const SecondaryCaregiverInfo = ({ additionalInfo, pageTitle }) => (
  <>
    {pageTitle && <h5 className="vads-u-font-size--h4">{pageTitle}</h5>}
    <p className="vads-u-margin-top--2">
      Please let us know if the Primary Family Caregiver is currently enrolled
      in the following health coverage options.
    </p>

    {additionalInfo && <SecondaryCaregiverLegal />}
  </>
);

SecondaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
  pageTitle: PropTypes.string,
};

export const FacilityInfo = () => (
  <>
    <div className="vads-u-margin-bottom--4">
      <b>Note:</b> You should choose the medical center or clinic closest to
      your home.
    </div>

    <a
      href={links.findLocations.link}
      rel="noopener noreferrer"
      target="_blank"
      className="vads-u-margin-x--0p5"
    >
      {links.findLocations.label}
    </a>
  </>
);

export const CaregiverSupportInfo = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="What's a Caregiver Support Coordinator ?">
      A Caregiver Support Coordinator is a clinical professional who connects
      Veteran caregivers with VA and community resources that offer supportive
      programs and services. Caregiver Support Coordinators are located at every
      VA medical center and specialize in caregiving issues.
    </AdditionalInfo>
  </div>
);

export const PrimaryHealthCoverage = ({ pageTitle }) => (
  <>
    {pageTitle && <h5 className="vads-u-font-size--h4">{pageTitle}</h5>}

    <div className="vads-u-margin-bottom--4 vads-u-margin-top--2">
      <p>
        Please complete the following information about the Primary Family
        Caregiver’s health coverage.
      </p>
    </div>
  </>
);

export const PleaseSelectVAFacility = () => (
  <div>
    <p>
      Please select the VA medical center or clinic where the Veteran receives
      or plans to receive health care services.
    </p>

    <p>
      A member of the Caregiver Support Program team at the VA medical center
      where the Veteran receives or plans to receive care will review your
      application.
    </p>
  </div>
);
