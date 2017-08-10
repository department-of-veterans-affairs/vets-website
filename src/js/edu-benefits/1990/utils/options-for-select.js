const maritalStatuses = [
  'Married',
  'Never Married',
  'Separated',
  'Widowed',
  'Divorced'
];

const branchesServed = [
  { value: 'air force', label: 'Air Force' },
  { value: 'army', label: 'Army' },
  { value: 'coast guard', label: 'Coast Guard' },
  { value: 'marine corps', label: 'Marine Corps' },
  { value: 'merchant seaman', label: 'Merchant Seaman' },
  { value: 'navy', label: 'Navy' },
  { value: 'noaa', label: 'Noaa' },
  { value: 'usphs', label: 'USPHS' },
  { value: 'f.commonwealth', label: 'Filipino Commonwealth Army' },
  { value: 'f.guerilla', label: 'Filipino Guerilla Forces' },
  { value: 'f.scouts new', label: 'Filipino New Scout' },
  { value: 'f.scouts old', label: 'Filipino Old Scout' },
  { value: 'other', label: 'Other' }
];

const dischargeTypes = [
  { value: 'honorable', label: 'Honorable' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other Than Honorable' },
  { value: 'bad-conduct', label: 'Bad Conduct' },
  { value: 'dishonorable', label: 'Dishonorable' },
  { value: 'undesirable', label: 'Undesirable' }
];

const suffixes = [
  'Jr.',
  'Sr.',
  'II',
  'III',
  'IV'
];

const genders = [
  { label: 'Female', value: 'F' },
  { label: 'Male', value: 'M' }
];

const months = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 }
];

const twentyNineDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
const thirtyDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
const thirtyOneDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

const days = {
  1: thirtyOneDays,
  2: twentyNineDays,
  3: thirtyOneDays,
  4: thirtyDays,
  5: thirtyOneDays,
  6: thirtyDays,
  7: thirtyOneDays,
  8: thirtyOneDays,
  9: thirtyDays,
  10: thirtyOneDays,
  11: thirtyDays,
  12: thirtyOneDays
};

const yesNo = [
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
];

const yesNoNA = yesNo.concat([{
  label: 'Does not apply', value: 'N/A'
}]);

const serviceBranches = [
  { label: 'Air Force', value: 'Air Force' },
  { label: 'Army', value: 'Army' },
  { label: 'Coast Guard', value: 'Coast Guard' },
  { label: 'Marine Corps', value: 'Marine Corps' },
  { label: 'Navy', value: 'Navy' }
];

const employmentPeriodTiming = [
  { label: 'Before military service', value: 'before' },
  { label: 'After military service', value: 'after' }
];

const schoolTypes = [
  { label: 'College, university, or other educational program, including online courses', value: 'college' },
  { label: 'Vocational flight training', value: 'flightTraining' },
  { label: 'National test reimbursement (for example, SAT or CLEP)', value: 'testReimbursement' },
  { label: 'Licensing or certification test reimbursement (for example, MCSE, CCNA, EMT, or NCLEX)', value: 'licensingReimbursement' },
  { label: 'Apprenticeship or on-the-job training', value: 'apprenticeship' },
  { label: 'Correspondence', value: 'correspondence' }
];

const schoolTypesWithTuitionTopUp = schoolTypes.concat({ label: 'Tuition assistance top-up (Post 9/11 GI Bill and MGIB-AD only)', value: 'tuitionTopUp' });

const contactOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Mail', value: 'mail' }
];

const accountTypes = [
  { label: 'Checking', value: 'checking' },
  { label: 'Savings', value: 'savings' }
];

const relinquishableBenefits = [
  { label: 'I’m only eligible for the Post-9/11 GI Bill', value: 'unknown' },
  { label: 'Montgomery GI Bill (MGIB-AD, Chapter 30)', additional: 'If you choose to give up MGIB-AD, you’ll get benefits only for the number of months you had left under MGIB-AD.', value: 'chapter30' },
  { label: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)', value: 'chapter1606' },
  { label: 'Reserve Educational Assistance Program (REAP, Chapter 1607)', additional: 'You can only give up REAP benefits if you had them for the last semester, quarter, or term that ended on or before November 24, 2015.', value: 'chapter1607' }
];

const hoursTypes = [
  { label: 'Semester', value: 'semester' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Clock', value: 'clock' }
];

const claimTypes = [
  { label: 'Montgomery GI Bill (MGIB-AD, Chapter 30)', value: 'chapter30' },
  { label: 'Post-Vietnam Era Veterans’ Educational Assistance Program (VEAP or Chapter 32)', value: 'chapter32' },
  { label: 'Post-9/11 GI Bill (Chapter 33)', value: 'chapter33' },
  { label: 'Survivors’ and Dependents’ Educational Assistance Program (Chapter 35)', value: 'chapter35' },
  { label: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)', value: 'chapter1606' },
  { label: 'Reserve Educational Assistance Program (REAP or Chapter 1607)', value: 'chapter1607' },
  { label: 'National Call to Service', value: 'nationalService' },
  { label: 'Use of Transferred Benefits', value: 'transferredBenefits' },
  { label: 'Vocational Rehabilitation and Employment (VR&E)', value: 'vocationalRehab' },
];

const binaryGenders = [
  { label: 'Female', value: 'F' },
  { label: 'Male', value: 'M' }
];

const ownBenefitsOptions = [
  { label: 'My own benefits', value: 'ownBenefits' },
  { label: 'My spouse or parent', value: 'spouseOrParent' }
];

const tourBenefits = [
  { label: 'Montgomery GI Bill – Active Duty (Chapter 30)', value: 'chapter30' },
  { label: 'Montgomery GI Bill – Selected Reserve (MGIB-SR or chapter 1606)', value: 'chapter1606' },
  { label: 'Post-Vietnam Era Veterans’ Educational Assistance Program (VEAP or Chapter 32)', value: 'chapter32' }
];

module.exports = {
  maritalStatuses,
  branchesServed,
  dischargeTypes,
  suffixes,
  genders,
  months,
  days,
  yesNo,
  yesNoNA,
  serviceBranches,
  schoolTypes,
  schoolTypesWithTuitionTopUp,
  employmentPeriodTiming,
  contactOptions,
  accountTypes,
  relinquishableBenefits,
  hoursTypes,
  claimTypes,
  binaryGenders,
  ownBenefitsOptions,
  tourBenefits
};
