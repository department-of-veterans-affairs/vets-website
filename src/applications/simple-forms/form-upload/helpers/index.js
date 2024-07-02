import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { uploadFile } from 'platform/forms-system/src/js/actions';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

export const getBreadcrumbList = formNumber => [
  { href: '/', label: 'VA.gov home' },
  {
    href: `/find-forms/about-form-${formNumber}`,
    label: `About VA Form ${formNumber}`,
    isRouterLink: true,
  },
  {
    href: `/form-upload/${formNumber}`,
    label: `Upload VA Form ${formNumber}`,
    isRouterLink: true,
  },
];

export const getFormNumber = location => {
  const path = location.pathname;
  const regex = /\/(\d{2}-\d{4})/;
  return path.match(regex)[1];
};

export const getFormUploadContent = formNumber => {
  if (formNumber === '21-0779') {
    return 'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';
  }

  return '';
};

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

export const createPayload = (file, formId) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  return payload;
};

export function uploadScannedForm(formNumber, fileToUpload, onFileUploaded) {
  const uiOptions = {
    fileUploadUrl: `${
      environment.API_URL
    }/simple_forms_api/v1/scanned_form_upload`,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: MAX_FILE_SIZE_BYTES,
    createPayload,
    parseResponse: ({ data }) => data?.attributes,
  };

  return dispatch => {
    const uploadRequest = uploadFile(
      fileToUpload,
      uiOptions,
      () => {}, // onProgress
      file => onFileUploaded(file),
      () => {}, // onError
    );
    uploadRequest(dispatch, () => ({
      form: {
        formId: formNumber,
      },
    }));
  };
}

export const submitForm = (
  formNumber,
  confirmationCode,
  history,
  options = null,
) => {
  apiRequest(`${environment.API_URL}/simple_forms_api/v1/submit_scanned_form`, {
    method: 'POST',
    body: JSON.stringify({
      confirmationCode,
      formNumber,
      options,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => {
    history.push(`/${formNumber}/confirmation`, {
      confirmationNumber: response.confirmationNumber,
      submittedAt: Date.now(),
    });
  });
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
