import React from 'react';
import PropTypes from 'prop-types';

import Email from './Email';
import Phone from './Phone';
import GoogleMapLink from './GoogleMapLink';
import { addressExists, getRepType } from '../utilities/helpers';
import { parsePhoneNumber } from '../utilities/parsePhoneNumber';

const CurrentAccreditedRepresentative = ({ currentRep }) => {
  const repAttributes = currentRep?.attributes;
  const repName = repAttributes?.fullName;
  const { contact, extension } = parsePhoneNumber(repAttributes?.phone);
  const email = repAttributes?.email;

  const recordContactLinkClick = () => {
    // pending analytics event
  };

  const parseRepType = () => {
    const repType = getRepType(currentRep);
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
            Your current {parseRepType().title}
          </h3>
          {repName && (
            <>
              <h4 className="vads-u-font-family--serif vads-u-margin-top--1p5 vads-u-margin-bottom--0p5">
                {repName}
              </h4>
              <p className="vads-u-margin-y--0">{parseRepType().subTitle}</p>
            </>
          )}
        </div>
        <p>
          <strong>Note:</strong> You can work with any accredited VSO
          representative at this organization.
        </p>
        <div className="representative-contact-section vads-u-margin-top--3">
          {addressExists(currentRep) && (
            <GoogleMapLink
              addressData={currentRep}
              recordClick={recordContactLinkClick}
            />
          )}
          {email && (
            <Email email={email} recordClick={recordContactLinkClick} />
          )}
          {contact && (
            <Phone
              contact={contact}
              extension={extension}
              recordClick={recordContactLinkClick}
            />
          )}
        </div>
      </div>
    </va-card>
  );
};

CurrentAccreditedRepresentative.propTypes = {
  currentRep: PropTypes.object,
};

export default CurrentAccreditedRepresentative;
