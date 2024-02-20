import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import { isFieldEmpty } from 'platform/user/profile/vap-svc/util';
import {
  addresses,
  phoneNumbers,
  personalInformation,
} from 'platform/user/profile/vap-svc/util/getProfileInfoFieldAttributes';
import {
  formatMultiSelectAndText,
  formatGenderIdentity,
} from 'platform/user/profile/vap-svc/util/personal-information/personalInformationUtils';

import { formatAddress } from 'platform/forms/address/helpers';

const ProfileInformationView = props => {
  const { data, fieldName, title, id } = props;

  const titleLower = title.toLowerCase();

  // decide whether to use 'a', or nothing in title string
  const titleFormatted =
    fieldName !== FIELD_NAMES.PRONOUNS ? `a ${titleLower}` : titleLower;

  const unsetFieldTitleSpan = <span>Choose edit to add {titleFormatted}.</span>;

  if (isFieldEmpty(data, fieldName)) {
    return unsetFieldTitleSpan;
  }

  if (fieldName === FIELD_NAMES.EMAIL) {
    // Use the .email-address-symbol class to add a zero-width spaces after @
    // and . symbols so very long email addresses will wrap at those symbols if
    // needed
    const regex = /(@|\.)/;
    const wrappableEmailAddress = data.emailAddress.split(regex).map(
      (part, i) =>
        regex.test(part) ? (
          <span className="email-address-symbol" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
    );
    return (
      <span style={{ wordBreak: 'break-word' }}>{wrappableEmailAddress}</span>
    );
  }

  if (phoneNumbers.includes(fieldName)) {
    const number = `${data.areaCode}${data.phoneNumber}`;
    return (
      <div>
        <va-telephone
          data-testid="phoneNumber"
          contact={number}
          extension={data.extension}
          not-clickable
        />
      </div>
    );
  }

  if (addresses.includes(fieldName)) {
    const { street, cityStateZip, country } = formatAddress(data);

    return (
      <div id={id}>
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

  // handle personal information field data and format accordingly for display
  if (fieldName in data && personalInformation.includes(fieldName)) {
    if (fieldName === FIELD_NAMES.PREFERRED_NAME) return data[fieldName];

    if (fieldName === FIELD_NAMES.GENDER_IDENTITY) {
      return formatGenderIdentity(data[fieldName]);
    }

    return formatMultiSelectAndText(data, fieldName) || unsetFieldTitleSpan;
  }

  return null;
};

ProfileInformationView.propTypes = {
  fieldName: PropTypes.oneOf(Object.values(FIELD_NAMES)).isRequired,
  data: PropTypes.object,
  id: PropTypes.string,
  title: PropTypes.string,
};

export default ProfileInformationView;
