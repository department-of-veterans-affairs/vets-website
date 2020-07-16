import React from 'react';
import PropTypes from 'prop-types';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { links } from 'applications/caregivers/definitions/content';

const VetInfo = ({ pageTitle, headerInfo }) => (
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

const PrimaryCaregiverInfo = ({ additionalInfo, pageTitle }) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}
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
              A Primary Family Caregiver is the main caregiver for the Veteran.
              They can be the Veteran’s or service member’s:
            </p>

            <ul>
              <li>Parent</li>
              <li>Spouse</li>
              <li>Son or daughter</li>
              <li>Step-family member</li>
              <li>Extended family member</li>
              <li>
                Non-family member who lives with the Veteran or service member,
                or will do so after approval
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

const SecondaryCaregiverLegal = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="What's a Secondary Family Caregiver?">
      <p>
        Secondary Family Caregivers are people approved as a “provider of
        personal care services” for the eligible Veteran under
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
        and generally serves as a backup to the Primary Family Caregiver.
      </p>

      <>
        <p>They can be the Veteran’s or service member’s:</p>

        <ul>
          <li>Parent</li>
          <li>Spouse</li>
          <li>Son or daughter</li>
          <li>Step-family member</li>
          <li>Extended family member</li>
          <li>
            Non-family member who lives with the Veteran or service member, or
            will do so after approval
          </li>
        </ul>
      </>
    </AdditionalInfo>
  </div>
);

const SecondaryCaregiverInfo = ({ pageTitle, additionalInfo, headerInfo }) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}
    {headerInfo && (
      <p className="vads-u-margin-top--2">
        Please complete the following information about the Secondary Family
        Caregiver.
      </p>
    )}

    {additionalInfo && <SecondaryCaregiverLegal />}
  </>
);

SecondaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
  pageTitle: PropTypes.string,
};

const FacilityInfo = () => (
  <div className="vads-u-margin-top--2p5">
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
  </div>
);

const CaregiverSupportInfo = () => (
  <div className="vads-u-margin-y--1p5">
    <AdditionalInfo triggerText="What's a Caregiver Support Coordinator ?">
      A Caregiver Support Coordinator is a clinical professional who connects
      Veteran caregivers with VA and community resources that offer supportive
      programs and services. Caregiver Support Coordinators are located at every
      VA medical center and specialize in caregiving issues.
    </AdditionalInfo>
  </div>
);

const PrimaryHealthCoverage = ({ pageTitle }) => (
  <>
    {pageTitle && <h3 className="vads-u-font-size--h4">{pageTitle}</h3>}

    <div className="vads-u-margin-bottom--4 vads-u-margin-top--2">
      <p>
        Please complete the following information about the Primary Family
        Caregiver’s health coverage.
      </p>
    </div>
  </>
);

const PleaseSelectVAFacility = () => (
  <div>
    <p>
      Please select the VA medical center or clinic where the Veteran receives
      or plans to receive health care services.
    </p>

    <p>
      A Caregiver Support Coordinator at this VA medical center will review your
      application.
    </p>
  </div>
);

const ReviewInfo = () => (
  <p>
    <b>Note:</b> According to federal law, there are criminal penalties,
    including a fine and/or imprisonment for up to 5 years, for withholding
    information or providing incorrect information. (See 18 U.S.C. 1001)
  </p>
);

const AdditionalCaregiverInfo = () => (
  <>
    <b>You can add up to 2 Secondary Family Caregivers.</b>
    <p>Would you like to add another Secondary Family Caregiver?</p>
  </>
);

export {
  AdditionalCaregiverInfo,
  CaregiverSupportInfo,
  FacilityInfo,
  PleaseSelectVAFacility,
  PrimaryCaregiverInfo,
  PrimaryHealthCoverage,
  ReviewInfo,
  SecondaryCaregiverInfo,
  SecondaryCaregiverLegal,
  VetInfo,
};
