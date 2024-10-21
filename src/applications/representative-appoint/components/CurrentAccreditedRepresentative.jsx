import React from 'react';
import PropTypes from 'prop-types';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

const CurrentAccreditedRepresentative = ({
  representativeName,
  type,
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  stateCode,
  zipCode,
  phone,
  email,
}) => {
  const { contact, extension } = parsePhoneNumber(phone);

  const addressExists = addressLine1 || city || stateCode || zipCode;

  const address =
    [
      (addressLine1 || '').trim(),
      (addressLine2 || '').trim(),
      (addressLine3 || '').trim(),
    ]
      .filter(Boolean)
      .join(' ') +
    (city ? ` ${city},` : '') +
    (stateCode ? ` ${stateCode}` : '') +
    (zipCode ? ` ${zipCode}` : '');

  const parseRepType = repType => {
    const parsedRep = {};
    switch (repType) {
      case 'organization':
        parsedRep.title = 'Veterans Service Organization (VSO)';
        parsedRep.subTitle = 'Veteran Service Organization';
        break;
      case 'attorney':
        parsedRep.title = 'accredited attorney';
        parsedRep.subTitle = 'Accredited attorney';
        break;
      case 'claimsAgent':
        parsedRep.title = 'accredited claims agent';
        parsedRep.subTitle = 'Accredited claims agent';
        break;
      default:
        parsedRep.title = 'accredited representative';
        parsedRep.subTitle = 'Accredited representative';
    }
    return parsedRep;
  };

  return (
    <va-card class="representative-result-card vads-u-padding--4 vads-u-background-color--gray-lightest vads-u-border--0">
      <div className="representative-result-card-content">
        <div className="representative-info-heading">
          <h3 className="vads-u-margin-y--0">
            Your current {parseRepType(type).title}
          </h3>
          {representativeName && (
            <>
              <h4 className="vads-u-font-family--serif vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
                {representativeName}
              </h4>
              <p className="vads-u-margin-y--0">
                {parseRepType(type).subTitle}
              </p>
              {/* {accreditedOrganizations?.length === 1 && (
                <p style={{ marginTop: 0 }}>{accreditedOrganizations[0]}</p>
              )} */}
            </>
          )}
        </div>
        <p>
          <strong>Note:</strong> You can work with any accredited VSO
          representative at this organization.
        </p>

        <div className="representative-contact-section vads-u-margin-top--3">
          {addressExists && (
            <div className="address-link vads-u-display--flex">
              <va-icon icon="location_on" size="3" />
              <a
                href={`https://maps.google.com?&daddr=${address}`}
                tabIndex="0"
                className="address-anchor vads-u-margin-left--1"
                // onClick={() => recordContactLinkClick()}
                target="_blank"
                rel="noreferrer"
                aria-label={`${address} (opens in a new tab)`}
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
          )}
          {contact && (
            <div className="vads-u-margin-top--1p5 vads-u-display--flex">
              <va-icon icon="phone" size="3" />
              <div className="vads-u-margin-left--1">
                <va-telephone
                  contact={contact}
                  extension={extension}
                  //   onClick={() => recordContactLinkClick()}
                  disable-analytics
                />
              </div>
            </div>
          )}
          {email && (
            <div className="vads-u-margin-top--1p5 vads-u-display--flex">
              <va-icon icon="mail" size="3" />
              <a
                href={`mailto:${email}`}
                // onClick={() => recordContactLinkClick()}
                className="vads-u-margin-left--1"
              >
                {email}
              </a>
            </div>
          )}
        </div>
      </div>
    </va-card>
  );
};

CurrentAccreditedRepresentative.propTypes = {
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  accreditedOrganizations: PropTypes.array,
  city: PropTypes.string,
  email: PropTypes.string,
  representativeName: PropTypes.string,
  phone: PropTypes.string,
  stateCode: PropTypes.string,
  type: PropTypes.string,
  zipCode: PropTypes.string,
  setFormData: PropTypes.func.isRequired,
};

export default CurrentAccreditedRepresentative;
