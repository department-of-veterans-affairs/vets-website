import React from 'react';

export const getFullName = (nameObj = {}) => {
  return [nameObj.first || '', nameObj.middle || '', nameObj.last || '']
    .filter(Boolean)
    .join(' ')
    .trim();
};

export const renderFullName = (nameObj, actionName = 'Veteran full name') => {
  const fullName = getFullName(nameObj);
  return fullName ? (
    <div className="dd-privacy-hidden" data-dd-action-name={actionName}>
      {fullName}
      {nameObj.suffix ? `, ${nameObj.suffix}` : ''}
    </div>
  ) : null;
};
