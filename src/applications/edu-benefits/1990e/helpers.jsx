import React from 'react';
import { cloneDeep } from 'lodash';

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import {
  newFormFields,
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
  SPONSOR_RELATIONSHIP,
} from './constants';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}

export const relationshipLabels = {
  spouse: 'Spouse',
  child: 'Child',
};

export function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

export function isAlphaNumeric(str) {
  const alphaNumericRegEx = new RegExp(/^[a-z0-9]+$/i);
  return alphaNumericRegEx.test(str);
}

export function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function eligibilityDescription() {
  return (
    <div className="usa-alert usa-alert-warning usa-content edu-benefits-alert">
      <div className="usa-alert-body">
        <ul>
          <li>
            You may be eligible for more than 1 education benefit program.
          </li>
          <li>You can only get payments from 1 program at a time.</li>
          <li>
            You can’t get more than 48 months of benefits under any combination
            of VA education programs.
          </li>
          <li>
            If you are unsure of what benefit has been transferred to you,
            please contact your Sponsor.
          </li>
        </ul>
      </div>
    </div>
  );
}

export const benefitsLabels = {
  chapter33: <p>Post-9/11 GI Bill (Chapter 33)</p>,
  chapter30: <p>Montgomery GI Bill (MGIB-AD, Chapter 30)</p>,
};

/**
 * Formats a date in human-readable form. For example:
 * January 1, 2000.
 *
 * @param {*} rawDate A date in the form '01-01-2000'
 * @returns A human-readable date string.
 */
export const formatReadableDate = rawDate => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateParts;
  let date;

  if (rawDate) {
    dateParts = rawDate.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const hideUnder18Field = (formData, fieldName) => {
  if (!formData || !formData[fieldName]) {
    return true;
  }

  const dateParts = formData && formData[fieldName].split('-');

  if (!dateParts || dateParts.length !== 3) {
    return true;
  }
  const birthday = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const today18YearsAgo = new Date(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18)).setHours(
      0,
      0,
      0,
      0,
    ),
  );

  return (
    !isValidCurrentOrPastDate(dateParts[2], dateParts[1], dateParts[0]) ||
    birthday.getTime() <= today18YearsAgo.getTime()
  );
};

export const addWhitespaceOnlyError = (field, errors, errorMessage) => {
  if (isOnlyWhitespace(field)) {
    errors.addError(errorMessage);
  }
};

export function prefillTransformer(pages, formData, metadata, state) {
  const claimant = state.data?.formData?.data?.attributes?.claimant || {};
  const contactInfo = claimant?.contactInfo || {};
  const sponsors = state.data?.formData?.attributes?.sponsors;
  const newData = {
    ...formData,
    sponsors,
    formId: state.data?.formData?.data?.id,
    claimantId: claimant.claimantId,
    'view:userFullName': {
      userFullName: {
        first: claimant.firstName || undefined,
        middle: claimant.middleName || undefined,
        last: claimant.lastName || undefined,
      },
    },
    dateOfBirth: claimant.dateOfBirth,
    email: {
      email: contactInfo.emailAddress,
      confirmEmail: contactInfo.emailAddress,
    },
    'view:phoneNumbers': {
      mobilePhoneNumber: {
        phone: contactInfo?.mobilePhoneNumber || undefined,
      },
      phoneNumber: {
        phone: contactInfo?.homePhoneNumber || undefined,
      },
    },
  };

  if (claimant?.suffix) {
    newData['view:userFullName'].userFullName.suffix = claimant?.suffix;
  }

  return {
    metadata,
    formData: newData,
    pages,
    state,
  };
}

export function mapSelectedSponsors(sponsors) {
  const selectedSponsors = sponsors.sponsors?.flatMap(
    sponsor => (sponsor.selected ? [sponsor.id] : []),
  );
  if (sponsors.someoneNotListed) {
    selectedSponsors.push(SPONSOR_NOT_LISTED_VALUE);
  }

  return selectedSponsors;
}

export function mapFormSponsors(formData, sponsors, fetchedSponsorsComplete) {
  return {
    ...formData,
    fetchedSponsorsComplete:
      fetchedSponsorsComplete || formData.fetchedSponsorsComplete,
    sponsors: {
      ...sponsors,
      loadedFromSavedState: true,
    },
    selectedSponsors: mapSelectedSponsors(sponsors),
    firstSponsor: sponsors.firstSponsor,
  };
}

export function updateSponsorsOnValueChange(
  sponsors,
  firstSponsor,
  value,
  checked,
) {
  const _sponsors = cloneDeep(sponsors);

  if (value === `sponsor-${SPONSOR_NOT_LISTED_VALUE}`) {
    _sponsors.someoneNotListed = checked;
  } else {
    const sponsorIndex = _sponsors.sponsors.findIndex(
      sponsor => `sponsor-${sponsor.id}` === value,
    );
    if (sponsorIndex > -1) {
      _sponsors.sponsors[sponsorIndex].selected = checked;
    }
  }

  _sponsors.selectedSponsors = mapSelectedSponsors(_sponsors);

  // Check to make sure that a previously-selected first sponsor hasn't
  // been removed from the list of selected sponsors.
  if (
    _sponsors.selectedSponsors.length <= 1 ||
    (!checked &&
      (value === `sponsor-${firstSponsor}` ||
        _sponsors.sponsors?.filter(s => s.selected)?.length < 2))
  ) {
    _sponsors.firstSponsor = null;
  }

  return _sponsors;
}

export function mapSponsorsToCheckboxOptions(sponsors) {
  const options =
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: `Sponsor ${index + 1}: ${sponsor.name}`,
      selected: sponsor.selected,
      value: `sponsor-${sponsor.id}`,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    selected: sponsors?.someoneNotListed,
    value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
  });
  const anySelectedOptions = !!options?.filter(o => o.selected)?.length;
  const values = Object.fromEntries(
    new Map(options?.map(option => [option.value, !!option.selected])),
  );

  return {
    anySelectedOptions,
    options,
    values,
  };
}

export const applicantIsChildOfSponsor = formData => {
  const numSelectedSponsors = formData[newFormFields.selectedSponsors]?.length;

  if (
    !numSelectedSponsors ||
    (numSelectedSponsors === 1 && formData.sponsors?.someoneNotListed) ||
    (numSelectedSponsors > 1 &&
      formData.firstSponsor === SPONSOR_NOT_LISTED_VALUE)
  ) {
    return (
      formData[newFormFields.newRelationshipToServiceMember] ===
      SPONSOR_RELATIONSHIP.CHILD
    );
  }

  const sponsors = formData.sponsors?.sponsors;
  const sponsor =
    numSelectedSponsors === 1
      ? sponsors?.find(s => s.selected)
      : sponsors?.find(s => s.id === formData.firstSponsor);

  return sponsor?.relationship === SPONSOR_RELATIONSHIP.CHILD;
};
