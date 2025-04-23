import _ from 'lodash';

import { hasSession } from 'platform/user/profile/utilities';
import { dateFieldToDate } from 'platform/utilities/date';
import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';
import { format, isBefore, isValid, parse } from 'date-fns';

export function getLabel(options, value) {
  const matched = _.find(options, option => option.value === value);

  return matched ? matched.label : null;
}

export function convertToggle() {
  const url = window.location.href;
  const params = new URLSearchParams(new URL(url).search);
  const toggleValues = params.get('toggle');
  return toggleValues?.toLowerCase() === 'false';
}
export function showSchoolAddress(educationType) {
  return (
    educationType === 'college' ||
    educationType === 'flightTraining' ||
    educationType === 'apprenticeship' ||
    educationType === 'correspondence'
  );
}

function formatDayMonth(val) {
  if (!val || !val.length || !Number(val)) {
    return 'XX';
  }
  if (val.length === 1) {
    return `0${val}`;
  }

  return val.toString();
}

export function formatYear(val) {
  if (!val || !val.length) {
    return 'XXXX';
  }

  // Strip non-digit characters
  const cleanedVal = val.replace(/\D/g, '');

  // Handle 2 digit years
  const parseFormat = cleanedVal.length === 2 ? 'yy' : 'yyyy';

  const yearDate = parse(cleanedVal, parseFormat, new Date());
  if (!isValid(yearDate)) {
    return 'XXXX';
  }

  return format(yearDate, 'yyyy');
}

export function formatPartialDate(field) {
  if (!field || (!field.month.value && !field.year.value)) {
    return undefined;
  }

  const day = field.day ? field.day.value : null;

  return `${formatYear(field.year.value)}-${formatDayMonth(
    field.month.value,
  )}-${formatDayMonth(day)}`;
}

export function displayDateIfValid(field) {
  if (!field.day.value && !field.month.value && !field.year.value) {
    return undefined;
  }

  return `${formatDayMonth(field.month.value)}/${formatDayMonth(
    field.day.value,
  )}/${formatYear(field.year.value)}`;
}

export function displayMonthYearIfValid(dateObject) {
  if (dateObject.year.value || dateObject.month.value) {
    return `${dateObject.month.value || 'XX'}/${dateObject.year.value ||
      'XXXX'}`;
  }

  return null;
}

export function showSomeoneElseServiceQuestion(claimType) {
  return claimType !== '' && claimType !== 'vocationalRehab';
}

export function hasServiceBefore1978(data) {
  return data.toursOfDuty.some(tour => {
    const fromDate = dateFieldToDate(tour.dateRange.from);
    return isValid(fromDate) && isBefore(fromDate, new Date('1978-01-02'));
  });
}

export function showRelinquishedEffectiveDate(benefitsRelinquished) {
  return benefitsRelinquished !== '' && benefitsRelinquished !== 'unknown';
}

export function getListOfBenefits(veteran) {
  const benefitList = [];

  if (veteran.chapter30) {
    benefitList.push(
      'Montgomery GI Bill (MGIB or Chapter 30) Education Assistance Program',
    );
  }

  if (veteran.chapter33) {
    benefitList.push('Post-9/11 GI Bill (Chapter 33)');
  }

  if (veteran.chapter1606) {
    benefitList.push(
      'Montgomery GI Bill Selected Reserve (MGIB-SR or Chapter 1606) Educational Assistance Program',
    );
  }

  if (veteran.chapter32) {
    benefitList.push(
      'Post-Vietnam Era Veterans’ Educational Assistance Program (VEAP or chapter 32)',
    );
  }

  return benefitList;
}

export function showYesNo(field) {
  if (field.value === '') {
    return '';
  }

  return field.value === 'Y' ? 'Yes' : 'No';
}

export function isValidRoutingNumber(value) {
  if (/^\d{9}$/.test(value)) {
    const digits = value.split('').map(val => parseInt(val, 10));
    const weighted =
      3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8]);

    return weighted % 10 === 0;
  }
  return false;
}

const additionalSchema = {
  edipi: {
    type: 'string',
  },
  icn: {
    type: 'string',
  },
};

const additionalUiSchema = {
  edipi: {
    'ui:options': {
      hideIf: () => true,
    },
  },
  icn: {
    'ui:options': {
      hideIf: () => true,
    },
  },
};

/**
 * Adds additional schema to the Applicant Information if the
 * user is authenticated which contains EDIPI and ICN fields.
 */
export const updateApplicantInformationPage = page =>
  hasSession()
    ? {
        ...page,
        schema: {
          ...page.schema,
          properties: {
            ...page.schema.properties,
            ...additionalSchema,
          },
        },
        uiSchema: {
          ...page.uiSchema,
          ...additionalUiSchema,
        },
      }
    : page;

export const applicantInformationTransform = formData => {
  const clonedData = _.cloneDeep(formData);
  delete clonedData.edipi;
  delete clonedData.icn;
  return clonedData;
};

/**
 * Injects custom CSS into shadow DOMs of specific elements at specific URLs
 * within an application. Convenience helper for the problem of custom styles
 * in apps' .sass files not applying to elements with shadow DOMs.
 *
 * So for instance, if you wanted to hide the 'For example: January 19 2000'
 * hint text that cannot be overridden normally:
 * ```
 * addStyleToShadowDomOnPages(
 *   ['/insurance-info'],
 *   ['va-memorable-date'],
 *   '#dateHint {display: none}'
 * )
 * ```
 *
 * @param {Array} urlArray Array of page URLs where these styles should be applied - to target all URLs, use value: ['']
 * @param {Array} targetElements Array of HTML elements we want to inject styles into, e.g.: ['va-select', 'va-radio']
 * @param {String} style String of CSS to inject into the specified elements on the specified pages
 */
export async function addStyleToShadowDomOnPages(
  urlArray,
  targetElements,
  style,
) {
  // If we're on one of the desired pages (per URL array), inject CSS
  // into the specified target elements' shadow DOMs:
  if (urlArray.some(u => window.location.href.includes(u)))
    targetElements.map(async e => {
      try {
        document.querySelectorAll(e).forEach(async item => {
          const el = await waitForShadowRoot(item);
          if (el?.shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            el.shadowRoot.adoptedStyleSheets.push(sheet);
          }
        });
      } catch (err) {
        // Fail silently (styles just won't be applied)
      }
    });
}

export function capitalizeFirstLetter(string) {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
