import React from 'react';
import { useSelector } from 'react-redux';

export const SelectedJobEmployerTitle = () => {
  const formData = useSelector(state => state.form.data);

  const { employerName } =
    formData.personalData.employmentHistory.veteran.employmentRecords[0] ?? '';

  return (
    <div>
      <h3 className="vads-u-margin-top--neg1p5">Your job at {employerName}</h3>{' '}
    </div>
  );
};
