import React from 'react';

export const VetTecScoContact = sco => {
  if (sco) {
    return (
      <div className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-margin-bottom--1">
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
