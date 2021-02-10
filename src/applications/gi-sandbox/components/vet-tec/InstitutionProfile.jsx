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
  const profileSections = {
    'Estimate your benefits': <div />,
    'Approved programs': <div />,
    'Veteran programs': <div />,
    'Application process': <div />,
    'Contact details': <div />,
  };

  return (
    <div>
      {
        <div className={profileLogo}>
          {renderVetTecLogo(classNames('vettec-logo-profile'))}
        </div>
      }
      <HeadingSummary institution={institution} showModal={showModal} />
      <ProfileNavBar profileSections={Object.keys(profileSections)} />
      <ul>
        {Object.entries(profileSections).map(([section, element]) => {
          return (
            <ProfileSection
              key={`${createId(name)}-profile-section`}
              name={section}
            >
              {element}
            </ProfileSection>
          );
        })}
      </ul>
    </div>
  );
};

export default InstitutionProfile;
