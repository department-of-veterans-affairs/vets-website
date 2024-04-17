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
