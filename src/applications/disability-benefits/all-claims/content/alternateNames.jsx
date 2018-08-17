import React from 'react';

export const AlternateNameViewField = ({ formData }) => {
  const { firstName, middleName, lastName } = formData;
  const middleString = middleName ? `${middleName} ` : '';
  return (
    <div>
      <strong>{firstName} {middleString}{lastName}</strong>
    </div>
  );
};
