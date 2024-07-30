import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import {
  SUBTITLE_0779,
  CHILD_CONTENT_0779,
  ADD_CHILD_CONTENT_0779,
  DOWNLOAD_URL_0779,
} from '../config/constants';

export const getFormNumber = (pathname = null) => {
  const path = pathname || window?.location?.pathname;
  const regex = /\/(\d{2}-\d{4})/;
  return path.match(regex)?.[1] || '';
};

const formMappings = {
  '21-0779': {
    additionalChildContent: ADD_CHILD_CONTENT_0779,
    childContent: CHILD_CONTENT_0779,
    subTitle: SUBTITLE_0779,
    pdfDownloadUrl: DOWNLOAD_URL_0779,
  },
};

export const getFormContent = (pathname = null) => {
  const formNumber = getFormNumber(pathname);
  const {
    subTitle = '',
    childContent = null,
    additionalChildContent = null,
    ombInfo = {},
  } = formMappings[formNumber] || {};

  return {
    additionalChildContent,
    childContent,
    formNumber,
    ombInfo,
    subTitle,
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

export const onCloseAlert = e => {
  e.target.visible = false;
};
