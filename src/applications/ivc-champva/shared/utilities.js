import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';

/**
 * Returns either a form of 'you', or the applicant's full name based
 * on the formData's `certifierRole` property. Assumes presences of an
 * `applicantName` key.
 * @param {object} formData Obj containing `certifierRole` and `applicantName
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
  const difference = Date.now() - Date.parse(date);
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
