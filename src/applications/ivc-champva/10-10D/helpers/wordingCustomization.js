// Extracting this to a function so there aren't a thousand identical
// ternaries we have to change later
export function sponsorWording(formData) {
  return formData?.certifierRole === 'sponsor' ? 'Your' : "Sponsor's";
}

export function applicantWording(formData) {
  return `${`${formData?.applicantName?.first || ''} ${
    formData?.applicantName?.last
  }` || 'Applicant'}'s `;
}
