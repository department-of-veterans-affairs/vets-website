import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { fromUnixTime, endOfDay, isPast, isValid } from 'date-fns';
import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';
import { isMinimalHeaderApp } from 'platform/forms-system/src/js/patterns/minimal-header';

// util to check if an in-progress form is expired
export const isExpired = expiresAt => {
  const ex = fromUnixTime(Number(expiresAt));
  return !isValid(ex) || isPast(endOfDay(ex));
};

/**
 * Returns either a form of 'you', or the applicant's full name based
 * on the formData's `certifierRole` property. Assumes presences of an
 * `applicantName` key.
 * @param {object} formData Obj containing `certifierRole` and `applicantName`
 * @param {boolean} isPosessive `true` if we want posessive form, `false` otherwise
 * @param {boolean} cap `true` if we want to capitalize first letter, `false` to leave as-is
 * @param {boolean} firstNameOnly `true` if we want just applicant's first name, `false` for full name
 * @returns String of the applicant's full name OR the appropriate form of 'you'
 */
export function nameWording(
  formData,
  isPosessive = true,
  cap = true,
  firstNameOnly = false,
) {
  let retVal = '';
  if (formData?.certifierRole === 'applicant') {
    retVal = isPosessive ? 'your' : 'you';
  } else {
    // Concatenate all parts of applicant's name (first, middle, etc...)
    retVal = firstNameOnly
      ? formData?.applicantName?.first
      : Object.values(formData?.applicantName || {})
          .filter(el => el)
          .join(' ');
    retVal = isPosessive ? `${retVal}’s` : retVal;
  }

  // Optionally capitalize first letter and return
  return cap ? retVal?.charAt(0)?.toUpperCase() + retVal?.slice(1) : retVal;
}

/**
 * Wrapper around `nameWording` that drops the `certifierRole` prop to prevent 'you/r' text
 * @param {object} formData Obj containing `applicantName`, or an array `applicants`
 * @param {boolean} isPosessive `true` if we want posessive form, `false` otherwise
 * @param {boolean} cap `true` if we want to capitalize first letter, `false` to leave as-is
 * @param {boolean} firstNameOnly `true` if we want just applicant's first name, `false` for full name
 * @returns
 */
export function applicantWording(formData, isPosessive, cap, firstNameOnly) {
  return nameWording(
    { ...formData, certifierRole: undefined }, // set certifierRole to prevent 'you' language
    isPosessive,
    cap,
    firstNameOnly,
  );
}

// Turn camelCase into capitalized words ("camelCase" => "Camel Case")
export function makeHumanReadable(inputStr) {
  return inputStr
    .match(/^[a-z]+|[A-Z][a-z]*/g)
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ');
}

/**
 * Evaluate the `depends` func of each provided page to determine
 * its value.
 * @param {object|list} pages A subset of pages within the form
 * @param {object} data formData used in `depends` calculations
 * @param {number} index Optional argument to pass to `depends` if evaluating list and loop page `depends`
 * @returns A filtered list of pages where `depends` was true
 */
export function getConditionalPages(pages, data, index) {
  const tmpPg =
    typeof pages === 'object' ? Object.keys(pages).map(pg => pages[pg]) : pages;
  return tmpPg.filter(
    pg => pg.depends === undefined || pg?.depends({ ...data }, index),
  );
}

// Expects a date as a string in YYYY-MM-DD format
export function getAgeInYears(date) {
  let difference = new Date(Date.now() - Date.parse(date));

  // Get UTC offset to account for local TZ (See https://stackoverflow.com/a/9756226)
  const utcOffsetSeconds =
    (difference.getTime() + difference.getTimezoneOffset() * 60 * 1000) / 1000;

  difference -= utcOffsetSeconds;

  return Math.abs(new Date(difference).getUTCFullYear() - 1970);
}

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

/**
 * Naively switches a date string from YYYY-MM-DD to MM-DD-YYYY
 * @param {object} data Object containing some number of top-level properties with "date" or "dob" in the keyname(s)
 * @returns copy of `data` with all top-level date properties adjusted
 */
export function adjustYearString(data) {
  const copy = JSON.parse(JSON.stringify(data));
  Object.keys(copy).forEach(key => {
    if (/date|dob/.test(key.toLowerCase())) {
      const date = copy[key];
      copy[key] = `${date.slice(5)}-${date.slice(0, 4)}`;
    }
  });
  return copy;
}

/**
 * Combine all street fields from an address into a single string.
 * @param {Object} addr Standard form address object containing one or more `street` properties (e.g., street, street1, street2)
 * @param {boolean} newLines Whether or not to separate streets with a '\n' character
 * @returns Copy of passed-in address object with a new `streetCombined` property (string)
 */
export function concatStreets(addr, newLines = false) {
  const updated = { ...addr, streetCombined: '' };
  if (addr) {
    for (const [k, v] of Object.entries(addr)) {
      updated.streetCombined += k.includes('street')
        ? `${v}${newLines ? '\n' : ' '}`
        : '';
    }
  }
  return updated;
}

/**
 * Retrieves an array of objects containing the property name specified
 * from the given object.
 *
 * @param {Object} obj - The input object to search for objects with keyname.
 * @param {String} [keyname="attachmentId"] - The keyname to search for within input obj
 * @returns {Array} - An array containing objects with the 'attachmentId' property.
 */
export function getObjectsWithAttachmentId(obj, keyname = 'attachmentId') {
  const objectsWithAttachmentId = [];
  _.forEach(obj, value => {
    if (_.isArray(value)) {
      _.forEach(value, item => {
        if (_.isObject(item) && _.has(item, keyname)) {
          objectsWithAttachmentId.push(item);
        }
      });
    }
  });

  return objectsWithAttachmentId;
}

/**
 * Produces a simple (non secure) hash of the passed in string.
 * See https://stackoverflow.com/a/8831937
 * @param {string} val string to be hashed
 * @returns hash of input string
 */
export function toHash(val) {
  const str = val ?? '';
  let hash = 0;
  Object.keys(str).forEach(i => {
    const chr = str.charCodeAt(i);
    hash = hash * 32 - hash + chr;
    hash = Math.floor(hash);
  });
  return hash.toString(16);
}

/**
 * Converts date string in YYYY-MM-DD fmt to MM/DD/YYYY
 * @param {String} date date in format YYYY-MM-DD
 * @returns d reformatted as MM/DD/YYYY
 */
export function fmtDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return '';
  }
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
}

/**
 * Wraps input in a <span> with dd-privacy-hidden class applied
 * @param {JSX|String} children JSX or string to wrap in a privacy class
 * @returns JSX
 */
export function privWrapper(children) {
  return <span className="dd-privacy-hidden">{children}</span>;
}

/**
 * Displays a standard ui:objectViewField but with individual keys/values
 * wrapped in the `dd-privacy-hidden` class to prevent PII entering RUM replays.
 * Helpful for cleaning up review page PII when setting classNames in `ui:options`
 * doesn't work (typically because of an `updateUiSchema` being used)
 * @param {Object} props Props passed to standard ui:objectViewField
 * @returns
 */
export function PrivWrappedReview(props) {
  // IMPORTANT: props.title could have PII, so exercise caution. Override
  // with an explicit `itemAriaLabel` as needed.
  const title = typeof props.title === 'function' ? props.title() : props.title;
  const ariaLabel = props?.uiSchema?.['ui:options']?.itemAriaLabel() ?? title;
  const editAriaLabel = `Edit ${ariaLabel}`;
  const Heading = isMinimalHeaderApp() ? 'h3' : 'h4';

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <Heading className="form-review-panel-page-header vads-u-font-size--h5">
          {privWrapper(title)}
        </Heading>
        <div className="vads-u-justify-content--flex-end">
          {props.defaultEditButton({ label: editAriaLabel })}
        </div>
      </div>
      <dl className="review dd-privacy-hidden">
        {props.renderedProperties.map(p => {
          return p;
        })}
      </dl>
    </div>
  );
}

PrivWrappedReview.propTypes = {
  defaultEditButton: PropTypes.any,
  formData: PropTypes.object,
  renderedProperties: PropTypes.any,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
};
