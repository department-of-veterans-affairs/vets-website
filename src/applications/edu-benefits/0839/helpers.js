import React from 'react';
import { CURRENCY_LABELS } from './constants';

export const validateInitials = (inputValue, firstName, lastName) => {
  if (!inputValue || inputValue.length === 0) {
    return '';
  }

  const lettersOnlyPattern = /^[A-Za-z]+$/;
  if (!lettersOnlyPattern.test(inputValue)) {
    return 'Please enter your initials using letters only';
  }

  let lastName2;

  const hyphenIndex = lastName.indexOf('-');
  if (hyphenIndex !== -1) {
    lastName2 = lastName.substring(hyphenIndex + 1);
  }

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const lastInitial2 = lastName2?.charAt(0).toUpperCase();

  const inputFirst = inputValue.charAt(0);
  const inputSecond = inputValue.charAt(1);

  if (inputFirst !== firstInitial || inputSecond !== lastInitial) {
    return `Initials must match your name: ${firstName} ${lastName}`;
  }

  if (inputValue.length === 3) {
    const inputThird = inputValue.charAt(2);

    if (inputThird !== lastInitial2) {
      return `Initials must match your name: ${firstName} ${lastName}`;
    }
  }

  return '';
};

export const formatAddress = str => {
  if (typeof str !== 'string' || str.trim().length === 0) {
    return str;
  }

  const exceptionsList = ['NW', 'NE', 'SW', 'SE', 'PO'];
  const exceptions = exceptionsList.map(item => item.toUpperCase());

  return str
    .trim()
    .split(/\s+/)
    .map(word => {
      const subWords = word.split('-');
      const formattedSubWords = subWords.map(subWord => {
        const upperSubWord = subWord.toUpperCase();

        if (exceptions.includes(upperSubWord)) {
          return upperSubWord;
        }

        const matchingException = exceptions.find(ex =>
          upperSubWord.startsWith(ex),
        );
        if (matchingException) {
          return matchingException + subWord.slice(matchingException.length);
        }

        if (/^\d+[A-Z]+$/.test(subWord)) {
          return subWord;
        }

        const numberLetterMatch = subWord.match(/^(\d+)([a-zA-Z]+)$/);
        if (numberLetterMatch) {
          const numbers = numberLetterMatch[1];
          const letters = numberLetterMatch[2];
          return `${numbers}${letters}`;
        }

        return subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase();
      });

      return formattedSubWords.join('-');
    })
    .join(' ');
};

export const toTitleCase = str => {
  if (typeof str !== 'string') {
    return '';
  }

  const trimmedStr = str.trim();

  if (!trimmedStr) {
    return '';
  }

  const words = trimmedStr.split(/\s+/);

  const titled = words.map(word => {
    const parts = word.split('-').map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return parts.join('-');
  });

  return titled.join(' ');
};
export const getCardDescription = item => {
  return item ? (
    <>
      <p>
        <strong>VA facility code: </strong>
        {item.facilityCode}
      </p>
      {item.institutionAddress && (
        <>
          <p className="vads-u-margin-bottom--0">
            {[
              formatAddress(item.institutionAddress.street),
              formatAddress(item.institutionAddress.street2),
              formatAddress(item.institutionAddress.street3),
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
          <p className="vads-u-margin-top--0">
            {toTitleCase(item.institutionAddress.city)}{' '}
            {item.institutionAddress.state},{' '}
            {item.institutionAddress.postalCode}
          </p>
        </>
      )}
    </>
  ) : null;
};

export const getCardTitle = item => {
  if (!item) return 'Institution Details';

  return (
    toTitleCase(item.institutionName) || `Facility Code: ${item.facilityCode}`
  );
};

export const additionalInstitutionDetailsArrayOptions = {
  arrayPath: 'additionalInstitutionDetails',
  nounSingular: 'location',
  nounPlural: 'locations',
  required: false,
  isItemIncomplete: item => !item?.facilityCode,
  maxItems: 10,
  text: {
    getItemName: item => getCardTitle(item),
    cardDescription: item => getCardDescription(item),
    summaryTitle: props => {
      const count = props?.formData?.additionalInstitutionDetails?.length || 0;
      const isWithdraw =
        props?.formData?.agreementType === 'withdrawFromYellowRibbonProgram';
      return count > 1
        ? `Review your additional locations ${isWithdraw ? 'to withdraw' : ''}`
        : `Review your additional location ${isWithdraw ? 'to withdraw' : ''}`;
    },
    summaryDescriptionWithoutItems: props => {
      const isWithdraw =
        props?.formData?.agreementType === 'withdrawFromYellowRibbonProgram';

      const header = isWithdraw
        ? 'You can withdraw more locations from this agreement'
        : 'You can add more locations to this agreement';

      const body = isWithdraw
        ? 'If you have any more campuses or additional locations to withdraw from this agreement, you can do so now. You will need a facility code for each location you would like to withdraw.'
        : 'If you have any more campuses or additional locations to add to this agreement, you can do so now. You will need a facility code for each location you would like to add.';

      return (
        <>
          <h3 className="vads-u-margin-top--0">{header}</h3>
          <p>{body}</p>
        </>
      );
    },
  },
};

export const createBannerMessage = institutionDetails => {
  let message = '';
  const code = institutionDetails?.facilityCode;
  const badFormat = code?.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const thirdChar = code?.charAt(2).toUpperCase();

  const hasXInThirdPosition =
    code?.length === 8 && !badFormat && thirdChar === 'X';

  if (hasXInThirdPosition) {
    message =
      "This facility code can't be accepted. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.";
    return message;
  }

  return message || null;
};

export const getAcademicYearDisplay = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`;
};

export const matchYearPattern = fieldData => {
  const startYear = fieldData.split('-')[0];
  const endYear = fieldData.split('-')[1];
  if (Number(endYear) !== Number(startYear) + 1) {
    return false;
  }
  const yearPattern = /^(\d{4}|XXXX)-(\d{4}|XXXX)$/;
  return yearPattern.test(fieldData);
};

const yellowRibbonCardTitleCase = str => {
  if (!str || typeof str !== 'string' || str.length === 0) {
    return '';
  }

  const minorWords = [
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'for',
    'nor',
    'as',
    'at',
    'by',
    'up',
    'out',
    'in',
    'of',
    'on',
    'to',
    'with',
    'from',
  ];
  const words = str
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);

  const result = words.map((word, index) => {
    if (index > 0 && index < words.length - 1 && minorWords.includes(word)) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return result.join(' ');
};

export const yellowRibbonProgramCardDescription = item => {
  if (!item) return null;
  return (
    <div>
      <p>
        {`Max. number of students: ${
          item?.maximumStudentsOption === 'specific'
            ? item?.maximumStudents
            : 'Unlimited'
        }`}
      </p>
      <p>{yellowRibbonCardTitleCase(item.degreeLevel)}</p>
      <p>{yellowRibbonCardTitleCase(item.collegeOrProfessionalSchool)}</p>
      <p>{CURRENCY_LABELS[item.schoolCurrency]}</p>
      <p>
        {!item.specificContributionAmount
          ? 'Pay remaining tuition that Post-9/11 GI Bill doesn’t cover (unlimited)'
          : `${item.collegeOrProfessionalSchool ? '$' : ''}${Number(
              item.specificContributionAmount,
            ).toLocaleString()}`}
      </p>
    </div>
  );
};
export const arrayBuilderOptions = {
  arrayPath: 'yellowRibbonProgramRequest',
  nounSingular: 'contribution',
  nounPlural: 'contributions',
  required: true,
  title: props => {
    const institutionDetails = props?.formData?.institutionDetails;
    const { isUsaSchool } = institutionDetails || {};
    return `${
      isUsaSchool ? 'U.S.' : 'Foreign'
    } Yellow Ribbon Program contributions`;
  },
  text: {
    getItemName: item => {
      return item?.academicYear || item?.academicYearDisplay;
    },
    cardDescription: item => yellowRibbonProgramCardDescription(item),
    summaryTitle: props => {
      const institutionDetails = props?.formData?.institutionDetails;
      const { isUsaSchool } = institutionDetails || {};
      return `Review your Yellow Ribbon Program contributions ${
        isUsaSchool ? '(U.S. schools)' : '(foreign schools)'
      }`;
    },
  },
};

export const addMaxContributions = arr => {
  return arr.reduce((acc, item) => {
    return acc + Number(item.maximumStudents || 0);
  }, 0);
};
export const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const code = (fieldData || '').trim();

  const currentItem = formData?.additionalInstitutionDetails?.find(
    item => item?.facilityCode?.trim() === code,
  );

  const additionalFacilityCodes = formData?.additionalInstitutionDetails?.map(
    item => item?.facilityCode?.trim(),
  );

  const facilityCodes = [
    ...additionalFacilityCodes,
    formData?.institutionDetails?.facilityCode,
  ];

  const isDuplicate = facilityCodes?.filter(item => item === code).length > 1;

  const badFormat = fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData);
  const notFound = currentItem?.institutionName === 'not found';
  const notYR = currentItem?.yrEligible === false;
  const thirdChar = code?.charAt(2).toUpperCase();

  const hasXInThirdPosition =
    code.length === 8 && !badFormat && thirdChar === 'X';

  if (!currentItem?.isLoading) {
    if (isDuplicate) {
      errors.addError(
        'You have already added this facility code to this form. Enter a new facility code, or cancel adding this additional location.',
      );
      return;
    }

    // TODO: move below 'not found' check after new response code is configured
    if (hasXInThirdPosition) {
      errors.addError(
        'Codes with an "X" in the third position are not eligible',
      );
      return;
    }

    if (badFormat || notFound) {
      errors.addError(
        'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
      );
      return;
    }

    if (notYR) {
      errors.addError(
        "The institution isn't eligible for the Yellow Ribbon Program.",
      );
    }
  }
};

export const showAdditionalPointsOfContact = formData => {
  const isYellowRibbonProgramPointOfContact =
    formData?.pointsOfContact?.roles?.isYellowRibbonProgramPointOfContact ===
    true;
  const isSchoolFinancialRepresentative =
    formData?.pointsOfContact?.roles?.isSchoolFinancialRepresentative === true;
  const isSchoolCertifyingOfficial =
    formData?.pointsOfContact?.roles?.isSchoolCertifyingOfficial === true;

  const hasBothRoles =
    (isYellowRibbonProgramPointOfContact || isSchoolFinancialRepresentative) &&
    isSchoolCertifyingOfficial;

  return !hasBothRoles;
};

export const getAdditionalContactTitle = formData => {
  const isYellowRibbonProgramPointOfContact =
    formData?.pointsOfContact?.roles?.isYellowRibbonProgramPointOfContact ===
    true;
  const isSchoolFinancialRepresentative =
    formData?.pointsOfContact?.roles?.isSchoolFinancialRepresentative === true;

  if (
    !isSchoolFinancialRepresentative &&
    !isYellowRibbonProgramPointOfContact
  ) {
    return 'Add Yellow Ribbon Program point of contact';
  }

  return 'Add school certifying official';
};

export const capitalizeFirstLetter = str => {
  if (!str || typeof str !== 'string') return '';
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const CustomReviewTopContent = () => {
  return (
    <h3 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--3">
      Review your form
    </h3>
  );
};
