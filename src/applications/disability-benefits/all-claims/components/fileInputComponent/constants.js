import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const FILE_TYPES = '.pdf,.jpg,.jpeg,.png,.gif,.bmp,.txt';
export const FILE_UPLOAD_TITLE = 'Select files to upload';
export const UPLOAD_URL = `${
  environment.API_URL
}/v0/upload_supporting_evidence`;

export const HINT_TEXT =
  'You can upload .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt files. Each file should be no larger than 50 MB for non-PDF files or 99 MB for PDF files. Larger files may take longer to upload, depending on the internet connection.';
export const LABEL_TEXT = 'Select files to upload';

export const ATTACHMENTS_TYPE = [
  { value: 'L015', label: 'Buddy/Lay Statement' },
  { value: 'L018', label: 'Civilian Police Reports' },
  { value: 'L029', label: 'Copy of a DD214' },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  { value: 'L703', label: 'Goldmann Perimetry Chart/Field Of Vision Chart' },
  { value: 'L034', label: 'Military Personnel Record' },
  { value: 'L478', label: 'Medical Treatment Records - Furnished by SSA' },
  { value: 'L048', label: 'Medical Treatment Record - Government Facility' },
  {
    value: 'L049',
    label: 'Medical Treatment Record - Non-Government Facility',
  },
  { value: 'L023', label: 'Other Correspondence' },
  { value: 'L070', label: 'Photographs' },
  {
    value: 'L222',
    label:
      'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance',
  },
  {
    value: 'L228',
    label:
      'VA Form 21-0781 - Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)',
  },
  {
    value: 'L229',
    label:
      'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
  },
  {
    value: 'L102',
    label:
      'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance',
  },
  {
    value: 'L107',
    label: 'VA Form 21-4142 - Authorization To Disclose Information',
  },
  {
    value: 'L827',
    label:
      'VA Form 21-4142a - General Release for Medical Provider Information',
  },
  {
    value: 'L115',
    label:
      'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
  },
  {
    value: 'L117',
    label:
      'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
  },
  {
    value: 'L159',
    label:
      'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
  },
  {
    value: 'L133',
    label: 'VA Form 21-674 - Request for Approval of School Attendance',
  },
  {
    value: 'L139',
    label: 'VA Form 21-686c - Declaration of Status of Dependents',
  },
  {
    value: 'L149',
    label:
      'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
  },
];

export const ADDITIONAL_INPUT_LABELS = {
  attachmentId: {
    L015: 'Buddy/Lay Statement',
    L018: 'Civilian Police Reports',
    L029: 'Copy of a DD214',
    L702: 'Disability Benefits Questionnaire (DBQ)',
    L703: 'Goldmann Perimetry Chart/Field Of Vision Chart',
    L034: 'Military Personnel Record',
    L478: 'Medical Treatment Records - Furnished by SSA',
    L048: 'Medical Treatment Record - Government Facility',
    L049: 'Medical Treatment Record - Non-Government Facility',
    L023: 'Other Correspondence',
    L070: 'Photographs',
    L222:
      'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance',
    L228:
      'VA Form 21-0781 - Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)',
    L229:
      'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
    L102:
      'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance',
    L107: 'VA Form 21-4142 - Authorization To Disclose Information',
    L827: 'VA Form 21-4142a - General Release for Medical Provider Information',
    L115:
      'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
    L117:
      'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
    L159:
      'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
    L133: 'VA Form 21-674 - Request for Approval of School Attendance',
    L139: 'VA Form 21-686c - Declaration of Status of Dependents',
    L149:
      'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
  },
};

export const PMR_ATTACHMENTS_TYPES = [
  {
    value: 'L049',
    label: 'Medical Treatment Record - Non-Government Facility',
  },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  {
    value: 'L107',
    label: 'VA 21-4142 Authorization for Release of Information',
  },
  { value: 'L023', label: 'Other' },
];

export const PMR_ADDITIONAL_INPUT_LABELS = {
  attachmentId: {
    L049: 'Medical Treatment Record - Non-Government Facility',
    L702: 'Disability Benefits Questionnaire (DBQ)',
    L107: 'VA 21-4142 Authorization for Release of Information',
    L023: 'Other',
  },
};

export const ADDITIONAL_ATTACHMENT_TITLE = 'What type of document is this?';
