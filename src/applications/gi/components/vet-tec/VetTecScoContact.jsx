import React from 'react';

export const VetTecScoContact = (sco, header) => {
  if (sco) {
    return (
      <div className="usa-width-one-half medium-6 columns">
        <div className="usa-width-one-whole">
          {header ? <h3>{header}</h3> : <div className="vads-u-margin-y--5" />}
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
                  </a>
                  {sco.phoneExtension && ` ext. ${sco.phoneExtension}`}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};
