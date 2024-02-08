import get from '@department-of-veterans-affairs/platform-forms-system/get';

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

export function firstPersonLanguage(formData, index) {
  return get('certifierRole', formData) === 'applicant' && (index || 0) === 0;
}

export function thirdPersonLanguage(formData, index) {
  return get('certifierRole', formData) !== 'applicant' || index !== 0;
}
