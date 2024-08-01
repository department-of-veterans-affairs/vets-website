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

export const additionalFilesHint =
  'Depending on your response, you may need to submit additional documents with this application.';
