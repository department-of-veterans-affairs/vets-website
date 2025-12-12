import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { focusElement } from 'platform/utilities/ui';
import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';
import { scrollTo } from 'platform/utilities/scroll';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import testData from '../tests/e2e/fixtures/data/veteran.json';
import {
  FORM_UPLOAD_FILE_UPLOADING_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
  FORM_UPLOAD_OCR_ALERT,
} from '../config/constants';

const formMappings = {
  '21-686c': {
    subTitle: 'Application Request to Add and/or Remove Dependents',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf',
  },
  '21-526EZ': {
    subTitle:
      'Application for Disability Compensation and Related Compensation Benefits',
    pdfDownloadUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-526EZ-ARE.pdf',
  },
  '21-0966': {
    subTitle:
      'Intent to File a Claim for Compensation and/or Pension, or Survivors Pension and/or DIC (VA Form 21-0966)',
  },
};

export const mockData = testData.data;

export const getFormNumber = (pathname = null) => {
  const path = pathname ?? window?.location?.pathname ?? '';
  const regex = /upload\/submit-va-form-([^/]+)/;
  const match = path.match(regex)?.[1]?.toLowerCase();
  const resolved =
    Object.keys(formMappings).find(key => key.toLowerCase() === match) || '';

  return resolved || '21-686c';
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
    title: `VA Form ${formNumber}`,
    message: 'Select a file to upload',
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
  focusElement('va-segmented-progress-bar');
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

export const maskVaFileNumber = vaFileNumber => {
  if (!vaFileNumber) return '';
  const number = vaFileNumber.slice(-4);
  return vaFileNumber.length === 8 ? `●●●●${number}` : `●●●●●${number}`;
};

export const onCloseAlert = e => {
  e.target.visible = false;
};

export const getMockData = () => {
  return !!mockData && environment.isLocalhost() && !window.Cypress
    ? mockData
    : undefined;
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
    return FORM_UPLOAD_OCR_ALERT(formNumber, onCloseAlert, warnings);
  }

  if (fileUploading && continueClicked) {
    return FORM_UPLOAD_FILE_UPLOADING_ALERT(onCloseAlert);
  }

  if (props.name === 'uploadPage') {
    return FORM_UPLOAD_INSTRUCTION_ALERT(onCloseAlert);
  }

  return null;
};

export function parseResponse({ data }) {
  const { name, size, confirmationCode } = data.attributes;
  return {
    name,
    confirmationCode,
    size,
  };
}

export function createPayload(file, formId, password) {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  if (password) {
    payload.append('password', password);
  }
  return payload;
}

export async function addStyleToShadowDomOnPages(
  urlArray,
  targetElements,
  style,
) {
  // If we're on one of the desired pages (per URL array), inject CSS
  // into the specified target elements' shadow DOMs:
  if (urlArray.some(u => window.location.href.includes(u)))
    targetElements.map(async e => {
      try {
        document.querySelectorAll(e).forEach(async item => {
          const el = await waitForShadowRoot(item);
          if (el?.shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            el.shadowRoot.adoptedStyleSheets.push(sheet);
          }
        });
      } catch (err) {
        // Fail silently (styles just won't be applied)
      }
    });
}
