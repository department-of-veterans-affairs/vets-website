import React from 'react';

import HeadingSummary from './HeadingSummary';
import ProfileSection from '../ProfileSection';
import ProfileNavBar from '../ProfileNavBar';
import { createId } from '../../utils/helpers';

const InstitutionProfile = ({ institution, showModal }) => {
  const loremIpsum = (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </div>
  );
  const profileSections = [
    {
      name: 'Estimate your benefits',
      component: loremIpsum,
    },
    {
      name: 'Approved programs',
      component: loremIpsum,
    },
    {
      name: 'Veteran programs',
      component: loremIpsum,
    },
    {
      name: 'Application process',
      component: loremIpsum,
    },
    {
      name: 'Contact details',
      component: loremIpsum,
    },
  ];

  const sectionNames = profileSections.map(({ name }) => name);

  return (
    <div>
      <HeadingSummary institution={institution} showModal={showModal} />
      <ProfileNavBar profileSections={sectionNames} />
      <div className="row">
        <ul>
          {profileSections.map(({ name, component }) => {
            return (
              <ProfileSection
                key={`${createId(name)}-profile-section`}
                name={name}
              >
                {component}
              </ProfileSection>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InstitutionProfile;
