import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

const SCOContactInformation = props => (
  <div>
    <div className="additional-information row vads-u-margin-y--4">
      <div className="usa-width-one-half medium-6 columns">
        <div className="physical-address usa-width-one-whole">
          <h3>School certifying officials</h3>
          <div>
            <div>
              {props.scos[0].firstName} {props.scos[0].lastName}
            </div>
            <div>{props.scos[0].title}</div>
            <div>
              <a href={`mailto:${props.scos[0].email}`}>
                {props.scos[0].email}
              </a>
            </div>
            <div>
              <a
                href={`tel:+1${`${props.scos[0].phoneAreaCode}-${props.scos[0].phoneNumber}`}`}
              >
                {props.scos[0].phoneAreaCode}
                {'-'}
                {props.scos[0].phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
      {props.scos.length > 1 && (
        <div className="usa-width-one-half medium-6 columns">
          <div className="mailing-address usa-width-one-whole">
            <h3>&nbsp;</h3>
            <div>
              <div>
                {props.scos[1].firstName} {props.scos[1].lastName}
              </div>

              <div>{props.scos[1].title}</div>

              <div>
                <a href={`mailto:${props.scos[1].email}`}>
                  {props.scos[1].email}
                </a>
              </div>
              <div>
                <a
                  href={`tel:+1${`${props.scos[1].phoneAreaCode}-${props.scos[1].phoneNumber}`}`}
                >
                  {props.scos[1].phoneAreaCode}
                  {'-'}
                  {props.scos[1].phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

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
    {!environment.isProduction() && (
      <SCOContactInformation scos={institution.schoolCertifyingOfficials} />
    )}
  </div>
);

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecContactInformation;
