// Produce a string that is either an applicant's name or
// "your" depending on additional context provided.
export function applicantWording(
  formData,
  context,
  isPosessive = true,
  _cap = true, // This doesn't matter now that we don't use 'you'/'your'
  _index, // Will be unused now that we don't use 'you'/'your'
) {
  let retVal = '';
  if (context) {
    // If we have additional context that means we have to dig for applicant
    const idx = +context?.formContext?.pagePerItemIndex;
    // const isApplicant = formData?.certifierRole === 'applicant';
    const appName = formData?.applicants[idx]?.applicantName;
    retVal = [appName?.first, appName?.middle, appName?.last, appName?.suffix]
      .filter(el => el)
      .join(' ');
  } else {
    // No context means we're directly accessing an applicant object
    retVal = [
      formData?.applicantName?.first,
      formData?.applicantName?.middle,
      formData?.applicantName?.last,
      formData?.applicantName?.suffix,
    ]
      .filter(el => el)
      .join(' ');
  }

  return isPosessive ? `${retVal}’s` : retVal;
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
