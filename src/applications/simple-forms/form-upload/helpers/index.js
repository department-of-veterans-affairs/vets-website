import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { focusByOrder, scrollTo } from 'platform/utilities/ui';

const formMappings = {
  '21-0779': {
    subTitle:
      'Request for Nursing Home Information in Connection with Claim for Aid and Attendance',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf',
  },
  '21-509': {
    subTitle: 'Statement of Dependency of Parent(s)',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-509-ARE.pdf',
  },
  '21P-0518-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Surviving Spouse with No Children)',
    pdfDownloadUrl: 'http://www.vba.va.gov/pubs/forms/VBA-21P-0518-1-ARE.pdf',
  },
  '21P-0516-1': {
    subTitle:
      'Improved Pension Eligibility Verification Report (Veteran with No Children)',
    pdfDownloadUrl: 'http://www.vba.va.gov/pubs/forms/VBA-21P-0516-1-ARE.pdf',
  },
};

export const getFormNumber = (pathname = null) => {
  const path = pathname || window?.location?.pathname;
  const regex = /upload\/([^/]+)/;
  const match = path.match(regex)?.[1].toUpperCase();
  if (formMappings[match]) {
    return match;
  }

  return '';
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
    title: `Upload form ${formNumber}`,
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
