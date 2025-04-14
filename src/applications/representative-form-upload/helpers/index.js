import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import {
  FORM_UPLOAD_FILE_UPLOADING_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
  FORM_UPLOAD_OCR_ALERT,
} from '../config/constants';

const formMappings = {
  '21-686c': {
    subTitle: 'Declaration of Status of Dependents',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf',
  },
};

export const getFormNumber = (pathname = null) => {
  const path = pathname || window?.location?.pathname;
  const regex = /upload\/([^/]+)/;
  const match = path.match(regex)?.[1];
  return (
    Object.keys(formMappings).find(key => key.toLowerCase() === match) || ''
  );
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

export const onClickContinue = (props, setContinueClicked) => {
  setContinueClicked(true);

  if (props.data?.uploadedFile?.name !== 'uploading') {
    props.onContinue();
  }
};

export const getAlert = (props, continueClicked) => {
  const warnings = props.data?.uploadedFile?.warnings;
  const fileUploading = props.data?.uploadedFile?.name === 'uploading';
  const formNumber = getFormNumber();

  if (warnings?.length > 0) {
    return FORM_UPLOAD_OCR_ALERT(
      formNumber,
      getPdfDownloadUrl(formNumber),
      onCloseAlert,
      warnings,
    );
  }

  if (fileUploading && continueClicked) {
    return FORM_UPLOAD_FILE_UPLOADING_ALERT(onCloseAlert);
  }

  return FORM_UPLOAD_INSTRUCTION_ALERT(onCloseAlert);
};
