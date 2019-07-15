import React from 'react';

export const renderSchoolClosingFlag = result => {
  const { schoolClosing } = result;
  if (!schoolClosing) return null;
  return (
    <div className="caution-flag">
      <i className="fa fa-warning" />
      School closing
    </div>
  );
};

export const renderCautionFlag = result => {
  const { cautionFlag } = result;
  if (!cautionFlag) return null;
  return (
    <div className="caution-flag">
      <i className="fa fa-warning" />
      Caution
    </div>
  );
};
