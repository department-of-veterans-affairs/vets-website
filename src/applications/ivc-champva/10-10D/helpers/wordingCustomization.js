// Extracting this to a function so there aren't a thousand identical
// ternaries we have to change later
export function sponsorWording(formData) {
  return formData?.certifierRole === 'sponsor' ? 'Your' : "Sponsor's";
}

// Produce a string that is either an applicant's name or
// "your" depending on additional context provided.
export function applicantWording(formData, context) {
  let retVal = '';
  if (context) {
    // If we have additional context that means we have to dig for applicant
    const idx = +context?.formContext?.pagePerItemIndex;
    const isApplicant = formData?.certifierRole === 'applicant';
    const name = `${formData?.applicants[idx]?.applicantName?.first} ${
      formData?.applicants[idx]?.applicantName?.last
    }`;

    retVal = idx === 0 && isApplicant ? 'Your ' : `${name}'s `;
  } else {
    // No context means we're directly accessing an applicant object
    retVal = `${`${formData?.applicantName?.first || ''} ${
      formData?.applicantName?.last
    }` || 'Applicant'}'s `;
  }
  return retVal;
}
