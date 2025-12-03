import React from 'react';
import { useSelector } from 'react-redux';
import { genderLabels } from 'platform/static-data/labels';
import { formatDate } from '../../utils/dates/formatting';

export const ConfirmationVeteranInfo = () => {
  const profile = useSelector(state => state.user?.profile) || {};
  const { dob, gender } = profile || {};
  const { first, middle, last, suffix } = profile.userFullName || {};

  return (
    <>
      <li>
        <div className="vads-u-color--gray">Veteran name</div>
      </li>
      <li>
        <div>{[first, middle, last, suffix].filter(Boolean).join(' ')}</div>
      </li>
      <li>
        <div className="vads-u-color--gray">Date of birth</div>
      </li>
      <li>
        <div>{dob ? formatDate(dob) : ''}</div>
      </li>
      <li>
        <div className="vads-u-color--gray">Gender</div>
      </li>
      <li>
        <div>{genderLabels[gender]}</div>
      </li>
    </>
  );
};
