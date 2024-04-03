// Produce a string that is either an applicant's name or
// "your" depending on additional context provided.
export function applicantWording(
  formData,
  context,
  isPosessive = true,
  cap = true,
  index,
) {
  let retVal = '';
  if (context) {
    // If we have additional context that means we have to dig for applicant
    const idx = +context?.formContext?.pagePerItemIndex;
    const isApplicant = formData?.certifierRole === 'applicant';
    const name = `${formData?.applicants[idx]?.applicantName?.first} ${
      formData?.applicants[idx]?.applicantName?.last
    }`;

    retVal =
      idx === 0 && isApplicant
        ? `you${isPosessive ? 'r ' : ''}`
        : `${name}${isPosessive ? '’s' : ''}`;
  } else {
    // No context means we're directly accessing an applicant object
    retVal = `${`${formData?.applicantName?.first || ''} ${
      formData?.applicantName?.last
    }` || 'Applicant'}${isPosessive ? '’s' : ''}`;
  }
  // Another edge case - if we don't have context, but we do have an index:
  if (index && +index === 0) retVal = isPosessive ? 'your' : 'you';

  // Optionally capitalize first letter and return
  return cap ? retVal.charAt(0).toUpperCase() + retVal.slice(1) : retVal;
}
