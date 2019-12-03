import React from 'react';

export const VetTecScoContact = sco => {
  if (sco) {
    return (
      <div className="vads-l-col--12 medium-screen:vads-l-col--6 large-screen:vads-l-col--4 vads-u-margin-bottom--2 sco-contact-info">
        <div>
          {sco.firstName} {sco.lastName}
        </div>
        <div>{sco.title}</div>
      </div>
    );
  }
  return null;
};
