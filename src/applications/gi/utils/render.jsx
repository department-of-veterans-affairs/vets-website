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

export const renderPreferredProviderFlag = result => {
  const { preferredProvider } = result;
  if (!preferredProvider) return null;
  return (
    <div className="preferred-flag">
      <i className="fa fa-star vads-u-color--gold" />
      Preferred Provider
    </div>
  );
};
