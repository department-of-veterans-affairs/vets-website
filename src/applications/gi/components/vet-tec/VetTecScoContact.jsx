import React from 'react';

export const VetTecScoContact = sco => {
  if (sco) {
    return (
      <div className="usa-width-one-half medium-6 columns vads-u-margin-bottom--1">
        <div className="usa-width-one-whole">
          <div>
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
                  <a
                    href={`tel:+1${`${sco.phoneAreaCode}-${sco.phoneNumber}`}`}
                  >
                    {sco.phoneAreaCode}
                    {'-'}
                    {sco.phoneNumber}
                    {sco.phoneExtension && `, ext. ${sco.phoneExtension}`}
                  </a>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};
