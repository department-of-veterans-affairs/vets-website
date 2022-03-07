import React from 'react';
import _ from 'lodash';

import JumpLink from 'platform/site-wide/jump-link/JumpLink';
import VetTecApprovedProgramsList from './VetTecApprovedProgramsList';
import ContactInformation from '../profile/ContactInformation';

import VetTecVeteranPrograms from './VetTecVeteranPrograms';
import VetTecEstimateYourBenefits from '../../containers/VetTecEstimateYourBenefits';
import ProfilePageHeader from '../../containers/ProfilePageHeader';
import ProfileSection from '../profile/ProfileSection';
import CautionaryInformation from '../profile/CautionaryInformation';
import GettingStartedWithVetTec from './GettingStartedWithVetTec';
import BackToTop from '../BackToTop';

export default function InstitutionProfile({
  institution,
  showModal,
  selectedProgram,
  compare,
  smallScreen,
}) {
  const program =
    selectedProgram || _.get(institution, 'programs[0].description', '');

  const institutionProfileId = 'institution-profile';
  const profilePageHeaderId = 'profile-page-header';

  const hasPrograms = institution.programs.length > 0;

  return (
    <div id={institutionProfileId} className="institution-profile">
      <div
        id={profilePageHeaderId}
        className="usa-grid vads-u-padding--0 vads-u-margin-bottom--4"
      >
        <div className="usa-width-three-fourths">
          <ProfilePageHeader institution={institution} />
        </div>

        <div className="usa-width-one-fourth">
          <nav id="table-of-contents" aria-labelledby="on-this-page">
            <h2
              id="on-this-page"
              className="vads-u-margin-bottom--2 vads-u-font-size--xl"
            >
              On this page
            </h2>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul className="usa-unstyled-list" role="list">
              {hasPrograms && (
                <li className="vads-u-margin-bottom--2">
                  <JumpLink
                    toId="calculate-your-benefits"
                    label="Calculate your benefits"
                  />
                </li>
              )}

              <li className="vads-u-margin-bottom--2">
                <JumpLink toId="approved-programs" label="Approved programs" />
              </li>

              <li className="vads-u-margin-bottom--2">
                <JumpLink
                  toId="getting-started-with-benefits"
                  label="Getting started with VET TEC"
                />
              </li>

              <li className="vads-u-margin-bottom--2">
                <JumpLink
                  toId="cautionary-information"
                  label="Cautionary information"
                />
              </li>

              <li className="vads-u-margin-bottom--2">
                <JumpLink
                  toId="profile-veteran-programs"
                  label="Veteran programs"
                />
              </li>

              <li className="vads-u-margin-bottom--2">
                <JumpLink
                  toId="get-started-with-career-scope"
                  label="Get started with CareerScope"
                />
              </li>

              <li className="vads-u-margin-bottom--2">
                <JumpLink
                  toId="contact-information"
                  label="Contact Information"
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {hasPrograms && (
        <ProfileSection
          label="Calculate your benefits"
          id="calculate-your-benefits"
        >
          <VetTecEstimateYourBenefits
            institution={institution}
            showModal={showModal}
            selectedProgram={program}
          />
        </ProfileSection>
      )}
      <ProfileSection label="Approved programs" id="approved-programs">
        <VetTecApprovedProgramsList
          programs={institution.programs}
          selectedProgram={program}
        />
      </ProfileSection>
      <ProfileSection
        label="Getting started with VET TEC"
        id="getting-started-with-benefits"
      >
        <GettingStartedWithVetTec />
      </ProfileSection>
      <ProfileSection
        label="Cautionary information"
        id="cautionary-information"
      >
        <CautionaryInformation
          institution={institution}
          onShowModal={showModal}
        />
      </ProfileSection>
      <ProfileSection label="Veteran programs" id="profile-veteran-programs">
        <VetTecVeteranPrograms
          institution={institution}
          onShowModal={showModal}
        />
      </ProfileSection>
      <ProfileSection
        label="Get started with CareerScope"
        id="get-started-with-career-scope"
      >
        CareerScope&#174; take career and educational planning to a new level.
        The proven career assessment and reporting system from the Vocational
        Research Insitute is a powerful, yet easy-to-use program. <br />
        <a
          href="https://va.careerscope.net/gibill"
          rel="noopener noreferrer"
          className="vads-c-action-link--blue"
        >
          Get started with CareerScope
        </a>
      </ProfileSection>{' '}
      <ProfileSection label="Contact Information" id="contact-information">
        <ContactInformation institution={institution} showModal={showModal} />
      </ProfileSection>
      <BackToTop
        parentId={institutionProfileId}
        profilePageHeaderId={profilePageHeaderId}
        compare={compare}
        smallScreen={smallScreen}
      />
    </div>
  );
}
