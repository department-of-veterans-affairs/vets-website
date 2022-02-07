import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { formatAddress } from '~/platform/forms/address/helpers';

import { FIELD_NAMES } from '@@vap-svc/constants';
import * as VAP_SERVICE from '@@vap-svc/constants';

import {
  addresses,
  phoneNumbers,
  personalInformation,
} from '@@profile/util/getProfileInfoFieldAttributes';

import {
  formatPronouns,
  formatGenderIdentity,
  formatSexualOrientation,
} from '@@profile/util/personal-information/personalInformationUtils';

const ProfileInformationView = props => {
  const { data, fieldName, title } = props;

  const titleLower = title.toLowerCase();

  // decide whether to use 'a', or nothing
  const titleFormatted =
    fieldName !== FIELD_NAMES.PRONOUNS ? `a ${titleLower}` : titleLower;

  if (!data) {
    return <span>Edit your profile to add {titleFormatted}.</span>;
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
    if (fieldName === 'preferredName') return data[fieldName];

    if (fieldName === 'pronouns') {
      try {
        return formatPronouns(data[fieldName], data?.pronounsNotListedText);
      } catch (err) {
        Sentry.captureException(err);
        return null;
      }
    }
    if (fieldName === 'genderIdentity') {
      return formatGenderIdentity(data[fieldName]);
    }

    try {
      return formatSexualOrientation(
        data[fieldName],
        data?.sexualOrientationNotListedText,
      );
    } catch (err) {
      Sentry.captureException(err);
      return null;
    }
  }

  return null;
};

ProfileInformationView.propTypes = {
  data: PropTypes.object,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
};

export default ProfileInformationView;
