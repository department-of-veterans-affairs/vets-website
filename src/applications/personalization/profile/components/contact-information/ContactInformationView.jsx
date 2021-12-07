import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { formatAddress } from '~/platform/forms/address/helpers';

import { FIELD_NAMES } from '@@vap-svc/constants';
import * as VAP_SERVICE from '@@vap-svc/constants';

import {
  addresses,
  phoneNumbers,
} from '@@profile/util/contact-information/getContactInfoFieldAttributes';

const ContactInformationView = props => {
  const { data, fieldName, title } = props;
  if (!data) {
    return <span>Edit your profile to add a {title.toLowerCase()}.</span>;
  }

  if (fieldName === FIELD_NAMES.EMAIL) {
    // Use the .email-address-symbol class to add a zero-width spaces after @
    // and . symbols so very long email addresses will wrap at those symbols if
    // needed
    const regex = /(@|\.)/;
    const wrappableEmailAddress = data.emailAddress
      .split(regex)
      .map(
        part =>
          regex.test(part) ? (
            <span className="email-address-symbol">{part}</span>
          ) : (
            part
          ),
      );
    return (
      <span style={{ wordBreak: 'break-word' }}>{wrappableEmailAddress}</span>
    );
  }

  if (phoneNumbers.includes(fieldName)) {
    return (
      <div>
        <Telephone
          contact={`${data.areaCode}${data.phoneNumber}`}
          extension={data.extension}
          notClickable
        />
      </div>
    );
  }

  if (addresses.includes(fieldName)) {
    const { street, cityStateZip, country } = formatAddress(data);

    return (
      <div>
        {street}
        <br />
        {cityStateZip}

        {country && (
          <>
            <br />
            {country}
          </>
        )}
      </div>
    );
  }

  return null;
};

ContactInformationView.propTypes = {
  data: PropTypes.object,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
};

export default ContactInformationView;
