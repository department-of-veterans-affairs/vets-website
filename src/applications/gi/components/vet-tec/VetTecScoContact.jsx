import React from 'react';

export const VetTecScoContact = sco => {
  if (sco) {
    return (
      <div
        key={`${sco.email}`}
        className="vads-l-col--12 medium-screen:vads-l-col--6 large-screen:vads-l-col--4 vads-u-margin-bottom--2 sco-contact-info"
      >
        <div>
          {sco.firstName} {sco.lastName}
        </div>
        <div>{sco.title}</div>
        <div>
          <a href={`mailto:${sco.email}`}>{sco.email}</a>
        </div>
        {sco.phoneAreaCode &&
          sco.phoneNumber && (
            <div>
              <a href={`tel:+1${`${sco.phoneAreaCode}-${sco.phoneNumber}`}`}>
                {sco.phoneAreaCode}
                {'-'}
                {sco.phoneNumber}
                {sco.phoneExtension && `, ext. ${sco.phoneExtension}`}
              </a>
            </div>
          )}
      </div>
    );
  }
  return null;
};
