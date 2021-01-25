import React from 'react';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import { links } from 'applications/caregivers/definitions/content';

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
        <AdditionalInfo triggerText="What&apos;s a Primary Family Caregiver?">
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
    <AdditionalInfo triggerText="What’s a Secondary Family Caregiver?">
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
    <p>Would you like to add another Secondary Family Caregiver?</p>
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
