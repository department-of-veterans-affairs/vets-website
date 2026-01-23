import React from 'react';

function convertNameToInitials(fullName) {
  const { first, last } = fullName;
  if (!first || !last) {
    return null;
  }

  // check for hyphenated last name
  let last2;
  const hyphenIndex = last.indexOf('-');
  if (hyphenIndex !== -1) {
    last2 = last.substring(hyphenIndex + 1);
  }

  const firstInitial = first.charAt(0).toUpperCase();
  const lastInitial = last.charAt(0).toUpperCase();
  const lastInitial2 = last2?.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}${lastInitial2 || ''}`.toUpperCase();
}

export function validateInitialsMatch(errors, fieldData, formData) {
  const firstName = formData?.authorizingOfficial?.fullName?.first || '';
  const lastName = formData?.authorizingOfficial?.fullName?.last || '';
  const expectedValue = convertNameToInitials(
    formData?.authorizingOfficial?.fullName,
  );

  const givenValue = fieldData ? fieldData.toUpperCase() : '';

  if (givenValue.length === 0) {
    return;
  }

  const lettersOnlyPattern = /^[A-Za-z]+$/;
  if (!lettersOnlyPattern.test(givenValue)) {
    errors.addError('Enter your initials using letters only');
    return;
  }

  if (expectedValue !== givenValue) {
    errors.addError(`Initials must match your name: ${firstName} ${lastName}`);
  }
}

export function getAtPath(data, path) {
  const parts = path.split('.');
  return parts.reduce((acc, val) => acc[val], data);
}

export function setAtPath(data, path, value) {
  const parts = path.split('.');
  const lastPart = parts.pop();

  let temp = data;
  parts.forEach(part => {
    temp = temp[part];
  });
  temp[lastPart] = value;
}

export function institutionResponseToObject(responseData) {
  const attrs = responseData.attributes || {};

  return {
    name: attrs.name,
    type: attrs.type,
    mailingAddress: {
      street: attrs.address1 || '',
      street2: attrs.address2 || '',
      street3: attrs.address3 || '',
      city: attrs.city || '',
      state: attrs.state || '',
      postalCode: attrs.zip || '',
      country: attrs.country || '',
    },
    physicalAddress: {
      street: attrs.physicalAddress1 || '',
      street2: attrs.physicalAddress2 || '',
      street3: attrs.physicalAddress3 || '',
      city: attrs.physicalCity || '',
      state: attrs.physicalState || '',
      postalCode: attrs.physicalZip || '',
      country: attrs.physicalCountry || '',
    },
  };
}

const baseAdditionalInstitutionsOptions = {
  arrayPath: 'additionalInstitutions',
  nounSingular: 'location',
  nounPlural: 'locations',
  required: false,
};

export const additionalInstitutionsWithCodeArrayOptions = {
  ...baseAdditionalInstitutionsOptions,
  isItemIncomplete: item => {
    return ![item?.name, item?.type, item?.mailingAddress].every(Boolean);
  },
  text: {
    cancelAddButtonText: props =>
      `Cancel adding this additional ${props.nounSingular}`,
    summaryTitle: props => `Review your additional ${props.nounPlural}`,
    cardDescription: item => {
      if (!item) return <></>;
      return (
        <>
          <p>
            <strong>VA facility code: </strong>
            {item.facilityCode}
          </p>
          <p>
            <strong>Mailing address: </strong>
            {[
              item.mailingAddress?.street,
              item.mailingAddress?.street2,
              item.mailingAddress?.street3,
              item.mailingAddress?.city,
              item.mailingAddress?.state,
            ]
              .filter(Boolean)
              .join(', ')}{' '}
            {item.mailingAddress?.postalCode}
          </p>
        </>
      );
    },
    summaryDescriptionWithoutItems: _props => {
      return (
        <div>
          <h3>
            You will need to list all additional locations associated with your
            institution
          </h3>
          <p>
            If you have any more campuses or additional locations to add to this
            agreement, you can do so now. You will need a facility code for each
            location you would like to add.
          </p>
        </div>
      );
    },
  },
};

export const additionalInstitutionsWithoutCodeArrayOptions = {
  ...baseAdditionalInstitutionsOptions,
  isItemIncomplete: item => {
    return ![item?.name, item?.mailingAddress].every(Boolean);
  },
  text: {
    cancelAddButtonText: props =>
      `Cancel adding this additional ${props.nounSingular}`,
    summaryTitle: props => `Review your additional ${props.nounPlural}`,
    cardDescription: item => {
      if (!item) return <></>;
      return (
        <>
          <p>
            <strong>Mailing address: </strong>
            {[
              item.mailingAddress?.street,
              item.mailingAddress?.street2,
              item.mailingAddress?.street3,
              item.mailingAddress?.city,
              item.mailingAddress?.state,
            ]
              .filter(Boolean)
              .join(', ')}{' '}
            {item.mailingAddress?.postalCode}
          </p>
        </>
      );
    },
    summaryDescriptionWithoutItems: _props => {
      return (
        <div>
          <h3>
            You will need to list all additional locations associated with your
            institution.
          </h3>
          <p>
            These are the extension campuses and additional locations officially
            associated with your institution. Any additional locations must be
            in the same country as the institution applying for the approval of
            foreign programs resides in.
          </p>
        </div>
      );
    },
  },
};

export const programInformationArrayOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  isItemIncomplete: item => {
    return ![
      item?.programName,
      item?.totalProgramLength,
      item?.weeksPerTerm,
      item?.entryRequirements,
      item?.creditHours,
    ].every(Boolean);
  },
  text: {
    getItemName: (item, _index, _fullData) => item.programName,
    cardDescription: item => {
      if (!item) return <></>;
      return (
        <div>
          <p>{item.totalProgramLength}</p>
          <p>
            {item.weeksPerTerm} week
            {parseFloat(item.weeksPerTerm) !== 1 ? 's' : ''}
          </p>
          <p>{item.entryRequirements}</p>
          <p>
            {item.creditHours} hour
            {parseFloat(item.creditHours) !== 1 ? 's' : ''}
          </p>
        </div>
      );
    },
  },
};
