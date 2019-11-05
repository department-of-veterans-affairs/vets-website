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

  const renderPhysicalAddress = () => (
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
  );

  const renderMailingAddress = () => (
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
  );

  const renderProviderEmail = () => (
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
  );

  const renderProviderPhone = () => (
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
            {phoneInfo(firstProgram.phoneAreaCode, firstProgram.phoneNumber)}
          </a>
        </div>
      </div>
    </div>
  );

  const renderSCOHeader = () =>
    institution.versionedSchoolCertifyingOfficials &&
    institution.versionedSchoolCertifyingOfficials.length > 0 && (
      <div>
        <h3>School certifying officials</h3>
        <hr />
      </div>
    );

  const renderPrimarySCOs = () =>
    primarySCOs &&
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
    );

  const renderSecondarySCOs = () =>
    secondarySCOs &&
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
    );

  const renderSCOContactInfoSection = () => (
    <div>
      <div>{renderSCOHeader()}</div>
      <div>{renderPrimarySCOs()}</div>
      {primarySCOs &&
        primarySCOs.length > 0 &&
        secondarySCOs &&
        secondarySCOs.length > 0 && <hr />}
      <div>{renderSecondarySCOs()}</div>
    </div>
  );

  const renderContactDetails = () => (
    <div>
      <div>{institution.physicalAddress1 && renderPhysicalAddress()}</div>
      <div>{institution.address1 && renderMailingAddress()}</div>
      <div>
        {firstProgram &&
          firstProgram.providerEmailAddress &&
          renderProviderEmail()}
      </div>
      <div>
        {firstProgram &&
          firstProgram.phoneAreaCode &&
          firstProgram.phoneNumber &&
          renderProviderPhone()}
      </div>
      <div>{renderSCOContactInfoSection()}</div>
    </div>
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
  return renderContactDetails();
};

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
