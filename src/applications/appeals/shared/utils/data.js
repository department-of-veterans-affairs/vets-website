import React from 'react';

import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

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

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
export const maskVafn = number => {
  return srSubstitute(
    `●●●–●●–${number}`,
    `V A file number ending with ${number.split('').join(' ')}`,
  );
};
