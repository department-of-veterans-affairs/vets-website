import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { FIELD_NAMES } from '@@vap-svc/constants';
import * as VAP_SERVICE from '@@vap-svc/constants';

import {
  addresses,
  phoneNumbers,
  personalInformation,
} from '@@profile/util/getProfileInfoFieldAttributes';

import {
  formatMultiSelectAndText,
  formatGenderIdentity,
} from '@@profile/util/personal-information/personalInformationUtils';
import { formatAddress } from '~/platform/forms/address/helpers';

const shouldShowUnsetFieldTitleSpan = (data, fieldName) => {
  // show if there is no data or a gender identity code is not present in data object
  return (
    !data ||
    (fieldName === FIELD_NAMES.GENDER_IDENTITY && !data?.[fieldName]?.code)
  );
};

const ProfileInformationView = props => {
  const { data, fieldName, title } = props;

  const titleLower = title.toLowerCase();

  // decide whether to use 'a', or nothing in title string
  const titleFormatted =
    fieldName !== FIELD_NAMES.PRONOUNS ? `a ${titleLower}` : titleLower;

  const unsetFieldTitleSpan = (
    <span>Edit your profile to add {titleFormatted}.</span>
  );

  if (shouldShowUnsetFieldTitleSpan(data, fieldName)) {
    return unsetFieldTitleSpan;
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
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  data: PropTypes.object,
  title: PropTypes.string,
};

export default ProfileInformationView;
