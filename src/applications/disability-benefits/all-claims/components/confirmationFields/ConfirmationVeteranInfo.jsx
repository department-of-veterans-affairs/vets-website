import React from 'react';
import { useSelector } from 'react-redux';
import { genderLabels } from 'platform/static-data/labels';
import { formatDate } from '../../utils/dates/formatting';

export const ConfirmationVeteranInfo = () => {
  const profile = useSelector(state => state.user?.profile) || {};
  const { dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName || {};

  return (
    <li>
      <div className="vads-u-color--gray">Veteran name</div>
      <div>
        {`${first || ''} ${middle || ''} ${last || ''}`}
        {suffix && `, ${suffix}`}
      </div>
      <div className="vads-u-color--gray">Date of birth:</div>
      <div>{dob ? formatDate(dob) : ''}</div>
      <div className="vads-u-color--gray">Gender:</div>{' '}
      <div>{genderLabels[gender]}</div>
    </li>
  );
};
