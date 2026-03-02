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
import {
  getSchedulingPreferencesTimesDisplay,
  getSchedulingPreferencesOptionDisplayName,
  isSchedulingPreference,
  preferredContactMethodDisplay,
} from 'platform/user/profile/vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { formatAddress } from 'platform/forms/address/helpers';

const ProfileInformationView = props => {
  const {
    data,
    fieldName,
    title,
    id,
    email,
    mailingAddress,
    homePhone,
    workPhone,
    mobilePhone,
  } = props;

  let displayTitle;
  let titleFormatted;
  let unsetFieldTitleSpan;

  // Choose title for display in profile info cards when field is unset
  if (isSchedulingPreference(fieldName)) {
    unsetFieldTitleSpan = <span>Choose edit to add a preference.</span>;
  } else {
    displayTitle = (phoneNumbers.includes(fieldName)
      ? title.replace(/ phone/i, '')
      : title
    ).toLowerCase();

    titleFormatted =
      fieldName !== FIELD_NAMES.PRONOUNS ? `a ${displayTitle}` : displayTitle;

    unsetFieldTitleSpan = <span>Choose edit to add {titleFormatted}.</span>;
  }

  if (isFieldEmpty(data, fieldName)) {
    return unsetFieldTitleSpan;
  }

  if (fieldName === FIELD_NAMES.EMAIL) {
    // Use the .email-address-symbol class to add a zero-width spaces after @
    // and . symbols so very long email addresses will wrap at those symbols if
    // needed
    const regex = /(@|\.)/;
    const wrappableEmailAddress =
      data?.emailAddress &&
      data.emailAddress.split(regex).map(
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
    const number = data.isInternational
      ? data.phoneNumber
      : `${data.areaCode}${data.phoneNumber}`;
    return (
      <div>
        <va-telephone
          data-testid="phoneNumber"
          country-code={data.isInternational ? data.countryCode : null}
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

    if (fieldName === FIELD_NAMES.MESSAGING_SIGNATURE)
      return (
        <>
          {data[fieldName].signatureName}
          <br />
          {data[fieldName].signatureTitle}
        </>
      );

    return formatMultiSelectAndText(data, fieldName) || unsetFieldTitleSpan;
  }

  if (fieldName in data && isSchedulingPreference(fieldName)) {
    displayTitle =
      getSchedulingPreferencesOptionDisplayName(fieldName, data[fieldName]) ||
      unsetFieldTitleSpan;
    switch (fieldName) {
      case FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD:
        return preferredContactMethodDisplay(
          email,
          mailingAddress,
          mobilePhone,
          homePhone,
          workPhone,
          data,
          fieldName,
        );
      case FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES:
        return getSchedulingPreferencesTimesDisplay(fieldName, data[fieldName]);
      case FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES:
        return getSchedulingPreferencesTimesDisplay(fieldName, data[fieldName]);
      default:
        return displayTitle;
    }
  }

  return null;
};

ProfileInformationView.propTypes = {
  fieldName: PropTypes.oneOf(Object.values(FIELD_NAMES)).isRequired,
  data: PropTypes.object,
  email: PropTypes.object,
  homePhone: PropTypes.object,
  id: PropTypes.string,
  mailingAddress: PropTypes.object,
  mobilePhone: PropTypes.object,
  title: PropTypes.string,
  workPhone: PropTypes.object,
};

export default ProfileInformationView;
