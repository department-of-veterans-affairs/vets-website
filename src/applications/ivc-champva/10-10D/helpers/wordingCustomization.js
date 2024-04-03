import { applicantWording as ApplicantWording } from '../../shared/utilities';

// Extracting this to a function so there aren't a thousand identical
// ternaries we have to change later
export function sponsorWording(formData, isPosessive = true, cap = true) {
  let retVal = '';
  if (formData?.certifierRole === 'sponsor') {
    retVal = isPosessive ? 'your' : 'you';
  } else {
    retVal = isPosessive ? 'sponsor’s' : 'sponsor';
  }

  // Optionally capitalize first letter and return
  return cap ? retVal.charAt(0).toUpperCase() + retVal.slice(1) : retVal;
}

// Produce a string that is either an applicant's name or
// "your" depending on additional context provided.
export function applicantWording(
  formData,
  context,
  isPosessive = true,
  cap = true,
  index,
) {
  // Using the applicantWording function in shared utils, but
  // holding off on updating all the imports in 1010d to keep
  // current PR concise - 1 APR 2024
  return ApplicantWording(formData, context, isPosessive, cap, index);
}

export const additionalFilesHint =
  'Depending on your response, you may need to submit additional documents with this application.';
