import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { uploadFile } from 'platform/forms-system/src/js/actions';
import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import {
  SUBTITLE_0779,
  CHILD_CONTENT_0779,
  ADD_CHILD_CONTENT_0779,
} from '../config/constants';

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

export const getFormNumber = () => {
  const path = window?.location?.pathname;
  const regex = /\/(\d{2}-\d{4})/;
  return path.match(regex)[1];
};

const formMappings = {
  '21-0779': {
    subtitle: SUBTITLE_0779,
    childContent: CHILD_CONTENT_0779,
    additionalChildContent: ADD_CHILD_CONTENT_0779,
  },
};

export const getFormContent = () => {
  const formNumber = getFormNumber();
  const { subtitle = '', childContent = null, additionalChildContent = null } =
    formMappings[formNumber] || {};

  return {
    title: `Upload VA Form ${formNumber}`,
    subtitle,
    childContent,
    additionalChildContent,
    formNumber,
  };
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

export const scrollAndFocusTarget = () => {
  scrollTo('topScrollElement');
  focusByOrder(['va-segmented-progress-bar', 'h1']);
};

export const isUnverifiedUser = formData => formData?.veteran?.loa !== 3;

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
export const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${number.split('').join(' ')}`,
  );
};

const createPayload = (file, formId) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  return payload;
};

export const uploadScannedForm = (formNumber, fileToUpload, onFileUploaded) => {
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
    uploadRequest(dispatch, () => ({ form: { formId: formNumber } }));
  };
};
