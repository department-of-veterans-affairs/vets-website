import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RepresentativeStatusApi from '../../../api/RepresentativeStatusApi';
import { parsePhoneNumber } from '../../../utilities/phoneNumbers';

export const Auth = ({ DynamicHeader, DynamicSubheader }) => {
  const [representative, setRepresentative] = useState({});

  const fetchRepStatus = async () => {
    const response = await RepresentativeStatusApi.getRepresentativeStatus;

    if (response.data.id) {
      const { attributes } = response.data;
      const { contact, extension } = parsePhoneNumber(attributes.phone);

      // address as displayed on contact card + google maps link
      const concatAddress = [
        attributes.addressLine1,
        attributes.addressLine2,
        attributes.addressLine3,
        attributes.city,
        attributes.stateCode,
        attributes.zipCode,
      ]
        .filter(str => str)
        .join(' ');

      // rep contact card
      const vcfData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${attributes.name}`,
        `TEL:${contact}`,
        `EMAIL:${attributes.email}`,
        `ADR:;;${concatAddress}`,
        'END:VCARD',
      ].join('\n');

      const encodedVCard = `data:text/vcard;charset=utf-8,${encodeURIComponent(
        vcfData,
      )}`;

      setRepresentative({
        id: response.data.id,
        repType: response.data.type,
        ...attributes,
        concatAddress,
        contact,
        extension,
        vcard: encodedVCard,
      });
    }
  };

  useEffect(() => {
    fetchRepStatus();
  }, []);

  const renderAuthNoRep = () => {
    return (
      <div className="auth-no-rep-text">
        <DynamicHeader className="auth-no-rep-header">
          You don’t have an accredited representative
        </DynamicHeader>
        <div className="auth-no-rep-body">
          <va-link
            href="https://va.gov/va-accredited-representative-faqs"
            text="Learn about accredited representatives"
          />
        </div>
      </div>
    );
  };
  const renderAuthRep = () => {
    return (
      <>
        <div className="auth-header-icon">
          <va-icon
            icon="account_circle"
            size={4}
            srtext="Your representative"
          />{' '}
        </div>
        <div className="auth-rep-text">
          <DynamicHeader className="auth-rep-header">
            Your accredited representative
          </DynamicHeader>
          <DynamicSubheader className="auth-rep-subheader">
            {representative.name}
          </DynamicSubheader>

          <div className="auth-rep-body">
            {representative.concatAddress && (
              <div className="contact-info vads-u-margin-top--1p5">
                <div className="contact-icon">
                  <va-icon
                    icon="location_on"
                    size={2}
                    srtext="Representative address"
                  />
                </div>

                <div className="address-link">
                  <a
                    href={`https://maps.google.com?daddr=${
                      representative.concatAddress
                    }`}
                    tabIndex="0"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${
                      representative.concatAddress
                    } (opens in a new tab)`}
                  >
                    {representative.addressLine1}{' '}
                    {representative.addressLine2 ? (
                      <>
                        <br /> {representative.addressLine2}
                      </>
                    ) : null}{' '}
                    <br />
                    {representative.city}, {representative.stateCode}{' '}
                    {representative.zipCode}
                  </a>
                </div>
              </div>
            )}
            {representative.email && (
              <div className="contact-info vads-u-margin-top--1p5">
                <div className="contact-icon">
                  <va-icon icon="mail" size={2} srtext="Representative email" />
                </div>
                <a href={`mailto:${representative.email}`}>
                  {representative.email}
                </a>
              </div>
            )}
            {representative.contact && (
              <div className="contact-info vads-u-margin-top--1p5">
                <div className="contact-icon">
                  <va-icon
                    icon="phone"
                    size={2}
                    srtext="Representative phone"
                  />
                </div>
                <va-telephone
                  contact={representative.contact}
                  extension={representative.extension}
                  disable-analytics
                />
              </div>
            )}

            {(representative.contact || representative.email) && (
              <div className="contact-info vads-u-margin-top--1p5">
                <va-link
                  download
                  filetype="VCF"
                  href={representative.vcard}
                  text="Download your accredited representative's contact information"
                />
              </div>
            )}
            <div className="contact-info vads-u-margin-top--1p5">
              <div className="contact-icon">
                <va-icon
                  icon="search"
                  size={2}
                  srtext="Learn about accredited representatives"
                />
              </div>
              <va-link
                href="https://va.gov/va-accredited-representative-faqs"
                text="Learn about accredited representatives"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <va-card>
        <div className="auth-card">
          {representative.id ? renderAuthRep() : renderAuthNoRep}
        </div>
      </va-card>
    </>
  );
};

Auth.propTypes = {
  DynamicHeader: PropTypes.string,
  hasRepresentative: PropTypes.bool,
};
