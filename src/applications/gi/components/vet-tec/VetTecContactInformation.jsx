import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

import { VetTecScoContact } from './VetTecScoContact';
import { phoneInfo } from '../../utils/helpers';

export const VetTecContactInformation = ({ institution }) => {
  const firstProgram = institution.programs[0];
  const primarySCOs = institution.versionedSchoolCertifyingOfficials.filter(
    SCO => SCO.priority === 'PRIMARY',
  );

  const secondarySCOs = institution.versionedSchoolCertifyingOfficials.filter(
    SCO => SCO.priority === 'SECONDARY',
  );

  /* Production flag for 19871 */
  if (environment.isProduction()) {
    return (
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
    );
  }
  return (
    <div>
      {institution.physicalAddress1 && (
        <div className="vads-l-row vads-u-margin-y--4">
          <div className="vads-l-col--12 medium-screen:vads-l-col--3">
            <h4 className="contact-heading">Physical address</h4>
          </div>
          <div className="vads-l-col--9">
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
      )}
      {institution.physicalAddress1 && (
        <div className="vads-l-row vads-u-margin-y--4">
          <div className="vads-l-col--12 medium-screen:vads-l-col--3">
            <h4 className="contact-heading">Mailing address</h4>
          </div>
          <div className="vads-l-col--9 ">
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
      )}
      {firstProgram &&
        firstProgram.providerEmailAddress && (
          <div className="vads-l-row vads-u-margin-y--4">
            <div className="vads-l-col--12 medium-screen:vads-l-col--3">
              <h4 className="contact-heading">Email address</h4>
            </div>
            <div className="vads-l-col--9 ">
              <div>
                <a href={`mailto:${firstProgram.providerEmailAddress}`}>
                  {firstProgram.providerEmailAddress}
                </a>
              </div>
            </div>
          </div>
        )}
      {firstProgram &&
        firstProgram.phoneAreaCode &&
        firstProgram.phoneNumber && (
          <div className="vads-l-row vads-u-margin-y--4">
            <div className="vads-l-col--12 medium-screen:vads-l-col--3">
              <h4 className="contact-heading">Phone number</h4>
            </div>
            <div className="vads-l-col--9 ">
              <div>
                <a
                  href={`tel:+1${`${phoneInfo(
                    firstProgram.phoneAreaCode,
                    firstProgram.phoneNumber,
                  )}`}`}
                >
                  {phoneInfo(
                    firstProgram.phoneAreaCode,
                    firstProgram.phoneNumber,
                  )}
                </a>
              </div>
            </div>
          </div>
        )}
      {institution.versionedSchoolCertifyingOfficials &&
        institution.versionedSchoolCertifyingOfficials.length > 0 && (
          <h3>School certifying officials</h3>
        )}
      {primarySCOs &&
        primarySCOs.length > 0 && (
          <div className="vads-l-row vads-u-margin-y--4">
            <div className="vads-l-col--12 medium-screen:vads-l-col--3">
              <h4 className="contact-heading">Primary</h4>
            </div>
            <div className="vads-l-col--9">
              <div className="vads-l-grid-container--full">
                <div className="vads-l-row">
                  {primarySCOs.map(sco => VetTecScoContact(sco))}
                </div>
              </div>
            </div>
          </div>
        )}
      {secondarySCOs &&
        secondarySCOs.length > 0 && (
          <div className="vads-l-row vads-u-margin-y--4">
            <div className="vads-l-col--12 medium-screen:vads-l-col--3">
              <h4 className="contact-heading">Secondary</h4>
            </div>
            <div className="vads-l-col--9">
              <div className="vads-l-grid-container--full">
                <div className="vads-l-row">
                  {secondarySCOs.map(sco => VetTecScoContact(sco))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
