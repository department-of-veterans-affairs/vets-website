import React from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { representativeTypeMap } from '../../utilities/representativeTypeMap';

export function CurrentRep({
  DynamicHeader,
  DynamicSubheader,
  poaType,
  name,
  addressLine1,
  addressLine2,
  city,
  stateCode,
  zipCode,
  email,
  contact,
  extension,
  concatAddress,
  vcfUrl,
}) {
  // "Learn more" link becomes Find-a-Rep link when place in profile (per design)
  const containerIsProfile =
    window.location.pathname === '/profile/accredited-representative';

  return (
    <va-card show-shadow>
      <div className="auth-card">
        <div className="auth-header-icon">
          <va-icon icon="account_circle" size={4} />{' '}
        </div>
        <div className="auth-rep-text">
          <DynamicHeader
            className="vads-u-font-size--h3 vads-u-margin-top--0"
            slot="headline"
          >
            Your current {representativeTypeMap(poaType)}
          </DynamicHeader>
          <DynamicSubheader className="vads-u-font-size--h4 vads-u-margin-top--0">
            {name}
          </DynamicSubheader>
          {poaType === 'organization' && (
            <p className="vads-u-margin-top--0">
              <strong>Note:</strong> You can work with any accredited VSO
              representative at this organization.
            </p>
          )}

          <div className="auth-rep-body">
            {concatAddress && (
              <div className="vads-u-display--flex vads-u-margin-top--1p5">
                <div className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5 vads-u-margin-right--1">
                  <va-icon
                    icon="location_on"
                    size={2}
                    srtext="Representative address"
                  />
                </div>

                <div className="address-link">
                  <a
                    href={`https://maps.google.com?daddr=${concatAddress}`}
                    tabIndex="0"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${concatAddress} (opens in a new tab)`}
                  >
                    {addressLine1}{' '}
                    {addressLine2 ? (
                      <>
                        <br /> {addressLine2}
                      </>
                    ) : null}{' '}
                    <br />
                    {city}, {stateCode} {zipCode}
                  </a>
                </div>
              </div>
            )}
            {poaType === 'representative' &&
              email && (
                <div className="vads-u-display--flex vads-u-margin-top--1p5">
                  <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
                    <va-icon
                      icon="mail"
                      size={2}
                      srtext="Representative email"
                    />
                  </div>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              )}
            {contact && (
              <div className="vads-u-display--flex vads-u-margin-top--1p5">
                <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
                  <va-icon
                    icon="phone"
                    size={2}
                    srtext="Representative phone"
                  />
                </div>
                <va-telephone
                  contact={contact}
                  extension={extension}
                  disable-analytics
                />
              </div>
            )}
            {poaType === 'representative' &&
              (contact || email) && (
                <div className="vads-u-display--flex vads-u-margin-top--1p5">
                  <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
                    <va-icon icon="file_download" size={2} />
                  </div>
                  <va-link
                    filetype="VCF"
                    filename="accredited_representative_contact"
                    href={vcfUrl}
                    text="Download your accredited representative's contact information"
                  />
                </div>
              )}
            <div className="vads-u-display--flex vads-u-margin-top--1p5">
              <div className="vads-u-margin-right--1 vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-top--0p5">
                <va-icon icon="search" size={2} />
              </div>
              {containerIsProfile ? (
                <va-link
                  href={`${
                    environment.BASE_URL
                  }/get-help-from-accredited-representative/find-rep`}
                  text="Find an accredited VSO representative at this organization"
                />
              ) : (
                <va-link
                  href={`${
                    environment.BASE_URL
                  }/resources/va-accredited-representative-faqs/`}
                  text="Learn about accredited representatives"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </va-card>
  );
}

CurrentRep.propTypes = {
  DynamicHeader: PropTypes.string,
  DynamicSubheader: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  city: PropTypes.string,
  concatAddress: PropTypes.string,
  contact: PropTypes.string,
  email: PropTypes.string,
  extension: PropTypes.string,
  name: PropTypes.string,
  poaType: PropTypes.string,
  stateCode: PropTypes.string,
  vcfUrl: PropTypes.string,
  zipCode: PropTypes.string,
};
