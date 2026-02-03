import React from 'react';
import { capitalize } from 'lodash';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AddressView } from 'platform/user/exportsFile';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import {
  FIELD_ITEM_IDS,
  FIELD_NAMES,
  FIELD_OPTION_IDS,
  FIELD_OPTION_IDS_INVERTED,
  FIELD_OPTION_IN_COPY,
  FIELD_SECTION_HEADERS,
  errorMessages,
} from '../../constants/schedulingPreferencesConstants';

import {
  getFormSchema as getContactMethodFormSchema,
  getUiSchema as getContactMethodUiSchema,
} from '../../components/SchedulingPreferences/preferred-contact-method';
import {
  getFormSchema as getContactTimesFormSchema,
  getUiSchema as getContactTimesUiSchema,
} from '../../components/SchedulingPreferences/preferred-contact-times';
import {
  getFormSchema as getAppointmentTimesFormSchema,
  getUiSchema as getAppointmentTimesUiSchema,
} from '../../components/SchedulingPreferences/preferred-appointment-times';
import PhoneView from '../../components/PhoneField/PhoneView';

// Simple fields that can edit inline (single-select radio buttons)
const INLINE_SCHEDULING_PREFERENCES = [
  FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
  FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER,
  FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING,
];

// Complex fields that need subtask editing (dropdown or multi-select, complex UI)
const SUBTASK_SCHEDULING_PREFERENCES = [
  FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD,
  FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES,
  FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES,
];

const SINGLE_VALUE_SCHEDULING_PREFERENCES = [
  ...INLINE_SCHEDULING_PREFERENCES,
  FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD,
];

const inlinePreferenceFormTitle = fieldName => {
  return `Select your ${FIELD_SECTION_HEADERS[fieldName]
    .toLowerCase()
    .replace(/s$/, '')}.`;
};

export const isSchedulingPreference = fieldName => {
  return [
    ...INLINE_SCHEDULING_PREFERENCES,
    ...SUBTASK_SCHEDULING_PREFERENCES,
  ].includes(fieldName);
};

export const isInlineSchedulingPreference = fieldName => {
  return INLINE_SCHEDULING_PREFERENCES.includes(fieldName);
};

export const isSingleSchedulingPreference = fieldName => {
  return SINGLE_VALUE_SCHEDULING_PREFERENCES.includes(fieldName);
};

export const isSubtaskSchedulingPreference = fieldName => {
  return SUBTASK_SCHEDULING_PREFERENCES.includes(fieldName);
};

export const schedulingPreferenceOptions = fieldName => {
  switch (fieldName) {
    case FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD:
      return FIELD_OPTION_IDS_INVERTED[
        FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD
      ];
    case FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES:
      return FIELD_OPTION_IDS_INVERTED[
        FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES
      ];
    case FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES:
      return FIELD_OPTION_IDS_INVERTED[
        FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES
      ];
    case FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER:
      return FIELD_OPTION_IDS_INVERTED[
        FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER
      ];
    case FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING:
      return FIELD_OPTION_IDS_INVERTED[
        FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING
      ];
    case FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING:
      return FIELD_OPTION_IDS_INVERTED[
        FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING
      ];
    default:
      return {};
  }
};

export const getSchedulingPreferenceInitialFormValues = (fieldName, data) => {
  // If we have data from API, use it; otherwise empty string for radio buttons
  if (isSingleSchedulingPreference(fieldName)) {
    return data ? { [fieldName]: data[fieldName] } : { [fieldName]: '' };
  }
  return data ? { [fieldName]: data[fieldName] } : { [fieldName]: [] };
};

const getSchedulingPreferenceItemId = fieldName => {
  return FIELD_ITEM_IDS[fieldName];
};

export const getSchedulingPreferencesOptionDisplayName = (
  fieldName,
  itemId,
) => {
  return FIELD_OPTION_IDS_INVERTED[fieldName]?.[itemId];
};

export const getSchedulingPreferencesOptionInCopy = (fieldName, itemId) => {
  return FIELD_OPTION_IN_COPY[fieldName]?.[itemId];
};

export const schedulingPreferencesUiSchema = fieldName => {
  switch (fieldName) {
    case FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD:
      return getContactMethodUiSchema();
    case FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES:
      return getContactTimesUiSchema();
    case FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES:
      return getAppointmentTimesUiSchema();
    default:
      return {
        [fieldName]: radioUI({
          title: inlinePreferenceFormTitle(fieldName),
          labels: { ...schedulingPreferenceOptions(fieldName) },
          errorMessages: {
            enum: errorMessages.noPreferenceSelected,
          },
        }),
      };
  }
};

export const schedulingPreferencesFormSchema = fieldName => {
  switch (fieldName) {
    case FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD:
      return getContactMethodFormSchema();
    case FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES:
      return getContactTimesFormSchema();
    case FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES:
      return getAppointmentTimesFormSchema();
    default:
      return {
        type: 'object',
        properties: {
          [fieldName]: {
            ...radioSchema(Object.keys(schedulingPreferenceOptions(fieldName))),
          },
        },
      };
  }
};

export const schedulingPreferencesConvertCleanDataToPayload = (
  data,
  fieldName,
) => {
  const itemId = getSchedulingPreferenceItemId(fieldName);
  const isSingle = isSingleSchedulingPreference(fieldName);
  let optionIds;
  if (isSingle) {
    optionIds = Object.values(data).map(value => {
      return value.replace('option-', '');
    });
  } else if (typeof data[fieldName] === 'string') {
    optionIds = [data[fieldName].replace('option-', '')];
  } else {
    optionIds = data[fieldName]
      .filter(value => {
        return value && value.startsWith('option-');
      })
      .map(value => {
        return value.replace('option-', '');
      });
  }
  return { itemId, optionIds };
};

// This method takes in a lot of different possible data shapes and normalizes them
// From API: { itemId: X, optionIds: [Y, Z] }
// From Redux single value: 'option-Y'
// From Redux multi value: ['option-Y', 'option-Z']
export const convertSchedulingPreferenceToReduxFormat = (item, fieldName) => {
  if (!item) return null;
  if (typeof item === 'string') {
    return item;
  }
  if (isSingleSchedulingPreference(fieldName)) {
    const [firstOptionId] = item.optionIds;
    return `option-${firstOptionId}`;
  }
  if (item.optionIds?.length) {
    return item.optionIds.map(optionId => `option-${optionId}`);
  }
  return item?.length ? item : [];
};

export const convertSchedulingPreferencesToReduxFormat = items => {
  const formattedData = {};
  items.preferences.forEach(item => {
    const fieldName = Object.keys(FIELD_ITEM_IDS).find(
      key => FIELD_ITEM_IDS[key] === item.itemId,
    );

    formattedData[fieldName] = convertSchedulingPreferenceToReduxFormat(
      item,
      fieldName,
    );
  });

  return formattedData;
};

export const getSchedulingPreferencesContactMethodDisplay = optionId => {
  const display = {
    title: getSchedulingPreferencesOptionDisplayName(
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD,
      optionId,
    ),
  };
  switch (optionId) {
    case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
      .TELEPHONE_MOBILE:
    case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
      .TEXT_MESSAGE:
      display.field = 'mobilePhone';
      display.link = `/profile/edit?fieldName=mobilePhone&returnPath=${encodeURIComponent(
        '/profile/health-care-settings/scheduling-preferences',
      )}`;
      display.linkTitle = 'mobile phone number';
      break;
    case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
      .TELEPHONE_HOME:
      display.field = 'homePhone';
      display.link = `/profile/edit?fieldName=homePhone&returnPath=${encodeURIComponent(
        '/profile/health-care-settings/scheduling-preferences',
      )}`;
      display.linkTitle = 'home phone number';
      break;
    case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
      .TELEPHONE_WORK:
      display.field = 'workPhone';
      display.link = `/profile/edit?fieldName=workPhone&returnPath=${encodeURIComponent(
        '/profile/health-care-settings/scheduling-preferences',
      )}`;
      display.linkTitle = 'work phone number';
      break;
    case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD].EMAIL:
      display.field = 'email';
      display.link = `/profile/edit?fieldName=email&returnPath=${encodeURIComponent(
        '/profile/health-care-settings/scheduling-preferences',
      )}`;
      display.linkTitle = 'contact email';
      break;
    case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD].US_POST:
      display.field = 'mailingAddress';
      display.link = `/profile/edit?fieldName=mailingAddress&returnPath=${encodeURIComponent(
        '/profile/health-care-settings/scheduling-preferences',
      )}`;
      display.linkTitle = 'mailing address';
      break;
    default:
      break;
  }

  return display;
};

export const getSchedulingPreferencesTimesDisplay = (fieldName, optionIds) => {
  if (!optionIds || optionIds.length === 0) return 'No preference';

  const displayNames = optionIds
    .filter(optionId => optionId && optionId.startsWith('option-'))
    .map(optionId =>
      getSchedulingPreferencesOptionDisplayName(fieldName, optionId),
    );

  if (displayNames.includes('No preference')) {
    return displayNames;
  }

  const days = {};
  displayNames.forEach(name => {
    const [day, timeOfDay] = name.split('_');
    const formattedDay = capitalize(day.toLowerCase());
    if (!days[formattedDay]) {
      days[formattedDay] = [];
    }
    days[formattedDay].push(timeOfDay.toLowerCase());
  });

  return (
    <ul className="vads-u-margin-y--0">
      {Object.entries(days).map(([day, times]) => (
        <li key={day}>
          {day}: {times.join(' or ')}
        </li>
      ))}
    </ul>
  );
};

const MissingContactMethodData = ({ displayDetails }) => {
  return (
    <va-alert status="error" visible class="vads-u-margin-y--2">
      <p className="vads-u-margin--0">
        You removed your {displayDetails.linkTitle} from your profile. Select{' '}
        <strong>Edit</strong> to change your preferred method of contact. Or
        select <strong>Add a {displayDetails.linkTitle}</strong> to update your
        contact information.
      </p>
      <p className="vads-u-margin--0 vads-u-margin-top--1">
        <VaLink
          href={displayDetails.link}
          text={`Add a ${displayDetails.linkTitle}`}
        />
      </p>
    </va-alert>
  );
};

MissingContactMethodData.propTypes = {
  displayDetails: PropTypes.object.isRequired,
};

export const preferredContactMethodDisplay = (
  email,
  mailingAddress,
  mobilePhone,
  homePhone,
  workPhone,
  data,
  fieldName,
) => {
  const displayDetails = getSchedulingPreferencesContactMethodDisplay(
    data[fieldName],
  );
  let hasError = false;
  let contactDetail;
  let customDetails;
  switch (displayDetails.field) {
    case 'email':
      hasError = !email;
      contactDetail = email?.emailAddress;
      break;
    case 'mailingAddress':
      hasError = !mailingAddress;
      customDetails = (
        <div className="vads-u-margin-y--0">
          <AddressView data={mailingAddress} />
        </div>
      );
      break;
    case 'mobilePhone':
      hasError = !mobilePhone;
      contactDetail = <PhoneView data={mobilePhone} />;
      break;
    case 'homePhone':
      hasError = !homePhone;
      contactDetail = <PhoneView data={homePhone} />;
      break;
    case 'workPhone':
      hasError = !workPhone;
      contactDetail = <PhoneView data={workPhone} />;
      break;
    default:
      contactDetail = displayDetails.title;
  }

  return (
    <>
      {hasError && <MissingContactMethodData displayDetails={displayDetails} />}
      {!displayDetails.field && (
        <p className="vads-u-margin-y--0">{displayDetails.title}</p>
      )}
      {displayDetails.field && (
        <>
          <p className="vads-u-margin-y--0">
            <strong>{displayDetails.title}</strong>
          </p>
          {!hasError && (
            <>
              {customDetails || (
                <p className="vads-u-margin-y--0">{contactDetail}</p>
              )}
              <p className="vads-u-margin-y--0">
                <VaLink
                  href={displayDetails.link}
                  text={`Update your ${displayDetails.linkTitle}`}
                />
              </p>
            </>
          )}
          {hasError && (
            <p className="vads-u-margin-y--0">
              No {displayDetails.linkTitle} found.
            </p>
          )}
        </>
      )}
    </>
  );
};
