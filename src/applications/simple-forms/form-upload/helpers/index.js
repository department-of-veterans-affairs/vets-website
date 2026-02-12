import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { focusByOrder } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import {
  FORM_UPLOAD_FILE_UPLOADING_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
  FORM_UPLOAD_OCR_ALERT,
  MUST_MATCH_ALERT,
} from '../config/constants';

export const formMappings = {
  '21-0779': {
    subTitle:
      'Request for Nursing Home Information in Connection with Claim for Aid and Attendance',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf',
    showSupportingDocuments: true,
  },
  '21-4192': {
    subTitle:
      'Request for Employment Information in Connection with Claim for Disability Benefits',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-4192-ARE.pdf',
  },
  '21-509': {
    subTitle: 'Statement of Dependency of Parent(s)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-509-ARE.pdf',
  },
  '21-8940': {
    subTitle:
      'Application for Increased Compensation Based on Un-employability',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-8940-ARE.pdf',
  },
  '21P-0516-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Veteran with No Children)',
    pdfDownloadUrl: 'http://www.vba.va.gov/pubs/forms/VBA-21P-0516-1-ARE.pdf',
  },
  '21P-0517-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Veteran with Children)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-0517-1-ARE.pdf',
  },
  '21P-0518-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Surviving Spouse with No Children)',
    pdfDownloadUrl: 'http://www.vba.va.gov/pubs/forms/VBA-21P-0518-1-ARE.pdf',
  },
  '21P-0519C-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Child or Children)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-0519C-1-ARE.pdf',
  },
  '21P-0519S-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Surviving Spouse with Children)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-0519S-1-ARE.pdf',
  },
  '21P-530a': {
    subTitle:
      'State Application for Interment Allowance (Under 38 U.S.C. Chapter 23)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-530a-ARE.pdf',
  },
  '21P-8049': {
    subTitle: 'Request for Details of Expenses',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-8049-ARE.pdf',
  },

  '21-2680': {
    subTitle:
      'Examination for Housebound Status or Permanent Need for Regular Aid and Attendance',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf',
  },

  '21-674b': {
    subTitle: 'School Attendance Report',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-674b-ARE.pdf',
  },

  '21-8951-2': {
    subTitle:
      'Notice of Waiver of VA Compensation or Pension to Receive Military Pay and Allowances',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-8951-2-ARE.pdf',
  },

  '21-0788': {
    subTitle: "Information Regarding Apportionment of Beneficiary's Award",
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0788-ARE.pdf',
  },

  '21-4193': {
    subTitle:
      'Notice to Department of Veterans Affairs of Veteran or Beneficiary Incarcerated in Penal Institution',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-4193-ARE.pdf',
  },

  '21P-4718a': {
    subTitle:
      'Certificate of Balance on Deposit and Authorization to Disclose Financial Records',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-4718a-ARE.pdf',
  },

  '21-4140': {
    subTitle: 'Employment Questionnaire',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-4140-ARE.pdf',
  },

  '21P-4706c': {
    subTitle: "Court Appointed Fiduciary's Account",
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-4706c-ARE.pdf',
  },

  '21-8960': {
    subTitle: 'Certification of School Attendance or Termination',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-8960-ARE.pdf',
  },

  '21-0304': {
    subTitle:
      "Application for Benefits for a Qualifying Veteran's Child Born with Disabilities",
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0304-ARE.pdf',
  },

  '21-651': {
    subTitle:
      'Election of Compensation in Lieu of Retired Pay or Waiver of Retired Pay to Secure Compensation from Department of Veterans Affairs (38 U.S.C. 5304(a)-5305)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-651-ARE.pdf',
  },

  '21P-4185': {
    subTitle: 'Report of Income from Property or Business',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-4185-ARE.pdf',
  },

  '21P-535': {
    subTitle:
      'Application for Dependency and Indemnity Compensation by Parent(s) (Including Accrued Benefits and Death Compensation when Applicable)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21P-535-ARE.pdf',
    showSupportingDocuments: true,
  },

  '20-10208': {
    subTitle: 'Document/Evidence Submission',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-20-10208-ARE.pdf',
    showSupportingDocuments: true,
  },
};

const extractFormSlug = path => {
  const regex = /upload\/([^/]+)/;
  return path.match(regex)?.[1] ?? '';
};

const findMatchingFormNumber = slug => {
  const lowerSlug = slug.toLowerCase();
  return (
    Object.keys(formMappings).find(key => key.toLowerCase() === lowerSlug) ?? ''
  );
};

export const getFormNumber = pathname => {
  const path = pathname ?? window?.location?.pathname;
  const match = extractFormSlug(path);
  return findMatchingFormNumber(match);
};

export const getFormContent = (pathname = null) => {
  const formNumber = getFormNumber(pathname);
  const { subTitle = '', ombInfo = {}, pdfDownloadUrl = '' } =
    formMappings[formNumber] || {};

  return {
    formNumber,
    ombInfo,
    subTitle,
    pdfDownloadUrl,
    title: `Upload VA Form ${formNumber}`,
  };
};

export const getPdfDownloadUrl = formNumber =>
  formMappings[formNumber]?.pdfDownloadUrl || '';

export const handleRouteChange = ({ detail }, history) => {
  const { href } = detail;
  history.push(href);
};

export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${Math.floor(num / 1000)} KB`;
  }
  return `${num} B`;
};

export const scrollAndFocusTarget = () => {
  scrollTo('topScrollElement');
  focusByOrder(['va-segmented-progress-bar', 'h2']);
};

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
export const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${number.split('').join(' ')}`,
  );
};

export const onCloseAlert = e => {
  e.target.visible = false;
};

export const getMockData = (mockData, isLocalhost) => {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
};

export const formattedPhoneNumber = phoneNumber => {
  const digits = phoneNumber.replaceAll('-', '');
  // Formats the phone number to look like this: (123) 456-7890
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

export const onClickContinue = (props, setContinueClicked) => {
  setContinueClicked(true);

  if (props.data?.uploadedFile?.name !== 'uploading') {
    props.onContinue();
  }
};

export const getAlert = (props, continueClicked) => {
  const warnings = props?.data?.uploadedFile?.warnings;
  const fileUploading = props?.data?.uploadedFile?.name === 'uploading';
  const veteranInformation =
    props?.name === 'nameAndZipCodePage' ||
    props?.name === 'veteranIdentificationInformationPage';
  const formNumber = getFormNumber();

  if (warnings?.length > 0) {
    return FORM_UPLOAD_OCR_ALERT(
      formNumber,
      getPdfDownloadUrl(formNumber),
      onCloseAlert,
      warnings,
      props?.data?.uploadedFile?.name || '',
    );
  }

  if (fileUploading && continueClicked) {
    return FORM_UPLOAD_FILE_UPLOADING_ALERT(onCloseAlert);
  }

  if (veteranInformation) {
    return MUST_MATCH_ALERT(props?.name, onCloseAlert, props?.data);
  }

  return FORM_UPLOAD_INSTRUCTION_ALERT(onCloseAlert, props?.formNumber);
};
