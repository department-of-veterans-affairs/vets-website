import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

import { VetTecScoContact } from './VetTecScoContact';

export const VetTecContactInformation = ({ institution }) => (
  <div>
    <div className="additional-information vads-l-grid-container--full">
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--6">
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
        <div className="vads-l-col--12 medium-screen:vads-l-col--6">
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
        <div>
          <div className="vads-u-margin-top--4">
            <h3>School certifying officials</h3>
          </div>
          <div className="vads-l-grid-container--full">
            <div className="vads-l-row">
              {institution.schoolCertifyingOfficials.map(sco =>
                VetTecScoContact(sco),
              )}
            </div>
          </div>
        </div>
      )}
  </div>
);

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
