import React from 'react';
import { useSelector } from 'react-redux';
import { genderLabels } from 'platform/static-data/labels';
import { formatDate } from '../../utils/dates/formatting';

export const ConfirmationVeteranInfo = () => {
  const profile = useSelector(state => state.user?.profile);
  const { dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;

  return (
    <div>
      <div className="vads-u-color--gray">Veteran name</div>
      {`${first || ''} ${middle || ''} ${last || ''}`}
      {suffix && `, ${suffix}`}
      <div className="vads-u-color--gray">Date of birth:</div>
      {dob ? formatDate(dob) : ''}
      <div className="vads-u-color--gray">Gender:</div> {genderLabels[gender]}
    </div>
  );
};
