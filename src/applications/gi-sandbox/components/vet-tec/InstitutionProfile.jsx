import React from 'react';

import HeadingSummary from './HeadingSummary';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';
import ProfileSection from '../ProfileSection';
import ProfileNavBar from '../ProfileNavBar';
import { createId } from '../../utils/helpers';

const profileLogo =
  'vads-u-display--block medium-screen:vads-u-display--none vettec-logo-container';

const InstitutionProfile = ({ institution, showModal }) => {
  const profileSections = [
    {
      name: 'Estimate your benefits',
      component: <div />,
    },
    {
      name: 'Approved programs',
      component: <div />,
    },
    {
      name: 'Veteran programs',
      component: <div />,
    },
    {
      name: 'Application process',
      component: <div />,
    },
    {
      name: 'Contact details',
      component: <div />,
    },
  ];

  const sectionNames = profileSections.map(({ name }) => name);

  return (
    <div>
      {
        <div className={profileLogo}>
          {renderVetTecLogo(classNames('vettec-logo-profile'))}
        </div>
      }
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
