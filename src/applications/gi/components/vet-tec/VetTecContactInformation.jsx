import React from 'react';
import PropTypes from 'prop-types';

export const VetTecContactInformation = ({ institution }) => (
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
);

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
