import _ from 'lodash';
import React from 'react';

import { ScoContact } from './ScoContact';
import LearnMoreLabel from '../LearnMoreLabel';
import { ariaLabels } from '../../constants';
import classNames from 'classnames';

export default function ContactInformation({ institution, showModal }) {
  const versionedSchoolCertifyingOfficials = _.get(
    institution,
    'versionedSchoolCertifyingOfficials',
    [],
  );

  const primarySCOs = versionedSchoolCertifyingOfficials.filter(
    SCO => SCO.priority.toUpperCase() === 'PRIMARY',
  );

  const physicalAddress = () =>
    institution.physicalAddress1 && (
      <div className="vads-l-row vads-u-margin-top--2p5 vads-u-margin-bottom--4">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h3 className="vads-u-font-size--h4 contact-heading vads-u-font-family--sans vads-u-margin--0">
            Physical address
          </h3>
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

  const mailingAddress = () =>
    institution.address1 && (
      <div className="vads-l-row vads-u-margin-top--0 vads-u-margin-bottom--4">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h3 className="vads-u-font-size--h4 contact-heading vads-u-font-family--sans vads-u-margin--0">
            Mailing address
          </h3>
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

  const singlePointContact = () => (
    <div>
      <h3 className="vads-u-margin-top--5 vads-u-margin-bottom--neg2p5">
        Single point of contact
      </h3>
      <hr />
      <div>
        <strong>
          <LearnMoreLabel
            text={'Single point of contact for Veterans'}
            onClick={() => showModal('singleContact')}
            ariaLabel={ariaLabels.learnMore.singlePoint}
            buttonId={'singleContact-button'}
          />
          :
        </strong>
        &nbsp;
        {institution.vetPoc ? 'Yes' : 'No'}
      </div>
    </div>
  );

  const primaryScos = () =>
    primarySCOs.length > 0 && (
      <div className="vads-l-row vads-u-margin-y--2">
        <div className="vads-l-col--12 medium-screen:vads-l-col--3">
          <h4
            id="primary-contact-header"
            className="contact-heading vads-u-font-family--sans vads-u-margin--0"
          >
            Primary
          </h4>
        </div>
        <div className="vads-l-col--9">
          <div className="vads-l-grid-container--full">
            <ul
              className="vads-l-row sco-list vads-u-margin--0 primary-sco-list"
              aria-labelledby="primary-contact-header"
            >
              {primarySCOs.map((sco, index) => ScoContact(sco, index))}
            </ul>
          </div>
        </div>
      </div>
    );

  const showSco = versionedSchoolCertifyingOfficials.length > 0;

  const schoolCertifyingOfficials = () =>
    showSco && (
      <div>
        <div>
          <h3 className="vads-u-margin-top--5 vads-u-margin-bottom--neg2p5">
            School certifying officials
          </h3>
          <hr />
        </div>
        {primaryScos()}
      </div>
    );

  const institutionCodesClassNames = classNames(
    'vads-u-margin-bottom--neg2p5',
    { 'vads-u-margin-top--5': !showSco },
  );

  const institutionCodes = () => (
    <div>
      <h3 className={institutionCodesClassNames}>Institution codes</h3>
      <hr />
      <div>
        <strong>
          <LearnMoreLabel
            text={'VA Facility Code'}
            onClick={() => showModal('facilityCode')}
            ariaLabel={ariaLabels.learnMore.facilityCode}
            buttonId={'facilityCode-button'}
          />
          :
        </strong>
        &nbsp;
        {institution.facilityCode || 'N/A'}
      </div>
      <div>
        <strong>
          <LearnMoreLabel
            text={'ED IPEDS code'}
            onClick={() => showModal('ipedsCode')}
            ariaLabel={ariaLabels.learnMore.ipedsCode}
            buttonId={'ipedsCode-button'}
          />
          :
        </strong>
        &nbsp;
        {institution.cross || 'N/A'}
      </div>
      <div>
        <strong>
          <LearnMoreLabel
            text={'ED OPE code'}
            onClick={() => showModal('opeCode')}
            ariaLabel={ariaLabels.learnMore.opeCode}
            buttonId={'opeCode-button'}
          />
          :
        </strong>
        &nbsp;
        {institution.ope || 'N/A'}
      </div>
    </div>
  );

  return (
    <div>
      {physicalAddress()}
      {mailingAddress()}
      {singlePointContact()}
      {schoolCertifyingOfficials()}
      {institutionCodes()}
    </div>
  );
}
