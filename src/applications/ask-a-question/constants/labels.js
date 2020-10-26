import PageDescription from '../components/PageDescription';
import SectionHeader from '../components/SectionHeader';

/* --------------- Inquiry --------------- */
export const inquiryChapterTitle = "Share why you're contacting us";
export const inquiryPageTitle = 'Your message';
export const inquiryPageDescription = PageDescription('Your message');

export const topicTitle =
  'Which topic best describes your question or message?';
export const topicDescription =
  'Please start typing below. If you do not find a match, type space to see all possible categories';
export const topicErrorMessage = 'Please enter a valid topic.';
export const inquiryTypeTitle = "Tell us the reason you're contacting us";
export const queryTitle = 'Please enter your question or message below';

/* --------------- Veteran Information --------------- */
export const veteranInformationChapterTitle = 'Tell us about the Veteran';
export const veteranInformationPageTitle = 'Veteran Information';

/* Veteran Status Information */
export const veteranStatusSectionDescription = SectionHeader(
  'How does a Veteran relate to your Question?',
);
export const veteranStatusTitle = 'My message is about benefits/services';
export const isDependentTitle = 'Are you the dependent?';
export const relationshipToVeteranTitle = 'Your relationship to the Veteran';
export const isDeceasedTitle = 'Is the Veteran deceased?';
export const dateOfDeathTitle = 'Date of Death if known';
export const branchOfServiceTitle = 'Branch of service';

/* Additional Veteran Information */
export const dateOfBirthTitle = 'Date of Birth';
export const socialSecurityNumberTitle = 'Social Security number';
export const serviceStartDateTitle = 'Service start date';
export const claimNumberTitle = 'Claim number';
export const serviceEndDateTitle = 'Service end date';
export const serviceNumberTitle = 'Service number';

/* Additional Veteran Errors */
export const socialSecurityNumberPatternErrorMessage =
  'Please enter a valid Social Security Number';
export const serviceNumberPatternErrorMessage =
  'Please enter a valid Service Number';
export const claimNumberPatternErrorMessage =
  'Please enter a valid Claim Number';
export const serviceDateRangeErrorMessage =
  'End of service must be after start of service';

/* --------------- Contact Information --------------- */
export const contactInformationChapterTitle = 'Tell us about yourself';
export const contactInformationPageTitle = 'Contact Information';
export const contactInformationPageDescription = PageDescription(
  'Your contact info',
);

export const preferredContactMethodTitle =
  'How should we get in touch with you?';
export const phoneTitle = 'Daytime phone';
export const emailTitle = 'Email';
export const daytimePhoneAreaCodeTitle = 'Daytime phone';

/* --------------- Dependent Information ------------- */
export const dependentInformationHeader = 'Dependent information';

export const dependentFirstName = "Dependent's first name";
export const dependentLastName = "Dependent's last name";
export const dependentRelationshipToVeteran = 'Your relation to the Veteran';

/* --------------- Veteran Information ------------- */
export const veteranInformationHeader = 'Veteran information';

export const veteransFirstName = "Veteran's first name";
export const veteransLastName = "Veteran's last name";

/* Address fields */
export const countryTitle = 'Country';
export const stateTitle = 'State';
export const canadaStateTitle = 'Province';
export const streetAddress = 'Street address';
export const streetTwoTitle = 'Line 2';
export const streetThreeTitle = 'Line 3';
export const cityTitle = 'City';
export const postalCodeTitle = 'Postal code';
export const zipCodeTitle = 'Zip code';

/* Address error messages */
export const stateOrProvinceMissingErrorMessage =
  'Please enter a state or province, or remove other address information.';
export const stateOrProvinceErrorMessage = 'Please select a state or province';
export const stateErrorMessage = 'Please enter a state';
export const streetErrorMessage = 'Please enter a street address';
export const cityErrorMessage = 'Please enter a city';
export const postalCodeErrorMessage = 'Please provide a valid postal code';
export const zipCodeRequiredErrorMessage = 'Please enter a zip code';
export const zipCodePatternErrorMessage =
  'Please enter a valid 5- or 9-digit zip code (dashes allowed)';

/* --------------- Other --------------- */
export const submitButtonText = 'Submit';
export const reviewPageTitle = 'Review your information';
export const savedFormNotFound = 'Please start over to apply for benefits.';
export const savedFormNoAuth = 'Please sign in again to continue your form';
export const formTitle = 'Contact us';
export const formSubTitle = 'Form 0873';
