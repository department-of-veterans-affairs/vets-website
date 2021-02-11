import React from 'react';

import HeadingSummary from './HeadingSummary';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';
import ProfileSection from '../ProfileSection';

const profileLogo =
  'vads-u-display--block medium-screen:vads-u-display--none vettec-logo-container';

const InstitutionProfile = ({ institution, showModal }) => {
  return (
    <div>
      {
        <div className={profileLogo}>
          {renderVetTecLogo(classNames('vettec-logo-profile'))}
        </div>
      }
      <HeadingSummary institution={institution} showModal={showModal} />
      <ul>
        <ProfileSection name="Estimate your benefits" />
        <ProfileSection name="Approved programs" />
        <ProfileSection name="Veteran programs" />
        <ProfileSection name="Application process" />
        <ProfileSection name="Contact details" />
      </ul>
    </div>
  );
};

export default InstitutionProfile;
