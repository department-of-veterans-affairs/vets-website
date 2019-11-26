import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

import { VetTecScoContact } from './VetTecScoContact';
import { phoneInfo } from '../../utils/helpers';

export const VetTecContactInformation = ({ institution }) => {
  const firstProgram = _.get(institution, 'programs[0]', {});

  const versionedSchoolCertifyingOfficials = _.get(
    institution,
    'versionedSchoolCertifyingOfficials',
    [],
  );

  const primarySCOs = versionedSchoolCertifyingOfficials.filter(
    SCO => SCO.priority === 'PRIMARY',
  );

  const secondarySCOs = versionedSchoolCertifyingOfficials.filter(
    SCO => SCO.priority === 'SECONDARY',
  );

  const renderPhysicalAddress = () =>
    institution.physicalAddress1 && (
      <div className="vads-l-row vads-u-margin-top--2p5 vads-u-margin-bottom--4">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4 className="contact-heading vads-u-font-family--sans vads-u-margin--0">
            Physical address
          </h4>
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

  const renderMailingAddress = () =>
    institution.address1 && (
      <div className="vads-l-row vads-u-margin-top--0 vads-u-margin-bottom--4">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4 className="contact-heading vads-u-font-family--sans vads-u-margin--0">
            Mailing address
          </h4>
        </div>
        <div className="vads-l-col--9 ">
          <div>
            <div>{institution.address1}</div>
            {institution.address2 && <div>{institution.address2}</div>}
            {institution.address3 && <div>{institution.address3}</div>}
            <div>
              {institution.city}, {institution.state} {institution.zip}
            </div>
          </div>
        </div>
      </div>
    );

  const renderProviderEmail = () =>
    firstProgram.providerEmailAddress && (
      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4 className="contact-heading vads-u-font-family--sans vads-u-margin--0">
            Email address
          </h4>
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

  const renderProviderPhone = () => {
    const phoneNumber = phoneInfo(
      firstProgram.phoneAreaCode,
      firstProgram.phoneNumber,
    );
    if (phoneNumber === '') {
      return null;
    }
    return (
      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4 className="contact-heading vads-u-font-family--sans vads-u-margin--0">
            Phone number
          </h4>
        </div>
        <div className="vads-l-col--9 ">
          <div>
            <a href={`tel:+1${`${phoneNumber}`}`}>{phoneNumber}</a>
          </div>
        </div>
      </div>
    );
  };

  const renderSCOHeader = () => (
    <div>
      <h3 className="vads-u-margin-top--5 vads-u-margin-bottom--neg2p5">
        School certifying officials
      </h3>
      <hr />
    </div>
  );

  const renderPrimarySCOs = () =>
    primarySCOs.length > 0 && (
      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4 className="contact-heading vads-u-font-family--sans vads-u-margin--0">
            Primary
          </h4>
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
    secondarySCOs.length > 0 && (
      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4 className="contact-heading vads-u-font-family--sans vads-u-margin--0">
            Secondary
          </h4>
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

  const renderSCOContactInfoSection = () =>
    versionedSchoolCertifyingOfficials.length > 0 && (
      <div>
        {renderSCOHeader()}
        {renderPrimarySCOs()}
        <hr />
        {renderSecondarySCOs()}
      </div>
    );

  const renderContactDetails = () => (
    <div>
      {renderPhysicalAddress()}
      {renderMailingAddress()}
      {renderProviderEmail()}
      {renderProviderPhone()}
      {renderSCOContactInfoSection()}
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
