import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

import { VetTecScoContact } from './VetTecScoContact';

export const VetTecContactInformation = ({ institution }) => (
  <div>
    <div className="additional-information row vads-u-margin-y--1">
      <div className="usa-width-one-half medium-6 columns">
        <div className="physical-address usa-width-one-whole">
          <h3>Physical address</h3>
          <div>
            {institution.physicalAddress1 && (
              <div>{institution.physicalAddress1}</div>
            )}
            {institution.physicalAddress2 && (
              <div>{institution.physicalAddress2}</div>
            )}
            {institution.physicalAddress3 && (
              <div>{institution.physicalAddress3}</div>
            )}
            <div>
              {institution.physicalCity}, {institution.physicalState}{' '}
              {institution.physicalZip}
            </div>
          </div>
        </div>
      </div>
      <div className="usa-width-one-half medium-6 columns">
        <div className="mailing-address usa-width-one-whole">
          <h3>Mailing address</h3>
          <div>
            {institution.address1 && <div>{institution.address1}</div>}
            {institution.address2 && <div>{institution.address2}</div>}
            {institution.address3 && <div>{institution.address3}</div>}
            <div>
              {institution.city}, {institution.state} {institution.zip}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Production flag for 19534 */}
    {!environment.isProduction() &&
      institution.schoolCertifyingOfficials[0] && (
        <React.Fragment>
          <div className="vads-u-margin-top--4">
            <h3>School certifying officials</h3>
          </div>
          {institution.schoolCertifyingOfficials.map(
            (sco, i) =>
              i % 2 === 0 && (
                <div className="additional-information row ">
                  {VetTecScoContact(sco)}
                  {institution.schoolCertifyingOfficials[i + 1] &&
                    VetTecScoContact(
                      institution.schoolCertifyingOfficials[i + 1],
                    )}
                </div>
              ),
          )}
        </React.Fragment>
      )}
  </div>
);

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
