import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import { datadogLogger } from '../hooks/useFindFormsBrowserMonitoring';
import {
  fetchFormsFailure,
  fetchFormsSuccess,
  fetchFormsSuccessNoResults,
} from '../actions';
import { filterDeletedForms } from '../helpers';

// Form URLs can be entered incorrectly, or the forms themselves can be deleted
// by forms managers. This guards against sending users to 404 pages
export const checkFormValidity = async (form, page) => {
  // Default to true in case we encounter an error
  // determining validity through the API.
  let formPdfIsValid = true;
  let formPdfUrlIsValid = true;
  let networkRequestError = false;
  const { url: downloadUrl, validPdf } = form.attributes;

  try {
    const isSameOrigin = downloadUrl?.startsWith(window.location.origin);

    formPdfIsValid = validPdf;

    if (formPdfIsValid && isSameOrigin) {
      // URLs can be entered invalid; this checks to make sure href is valid
      // NOTE: There are Forms URLS under the https://www.vba.va.gov/ domain, we don't have a way currently to check if URL is valid on FE because of CORS
      const response = await fetch(downloadUrl, {
        method: 'HEAD', // HEAD METHOD SHOULD NOT RETURN BODY, WE ONLY CARE IF REQ WAS SUCCESSFUL
      });

      if (!response.ok) {
        formPdfUrlIsValid = false;
      }
    }
  } catch (err) {
    if (err) {
      networkRequestError = true;
    }

    datadogLogger(
      form,
      downloadUrl,
      `Find Forms - ${page} - onDownloadLinkClick function error`,
    );
  }

  return {
    formPdfIsValid,
    formPdfUrlIsValid,
    networkRequestError,
  };
};

export const allFormsRetired = forms => {
  const validForms = forms?.filter(
    form =>
      (form.attributes?.validPDF || form.attributes?.validPdf) &&
      (form.attributes?.deletedAt === null ||
        form.attributes?.deletedAt === undefined ||
        form.attributes?.deletedAt.length === 0),
  );

  return !validForms.length;
};

export const fetchFormsApi = async (query, dispatch) => {
  const FORMS_URL = appendQuery('/forms', { query });

  try {
    const response = await apiRequest(FORMS_URL);
    const forms = filterDeletedForms(response?.data);

    if (forms?.length) {
      dispatch(fetchFormsSuccess(forms, allFormsRetired(forms)));
    }

    if (forms?.length === 0) {
      dispatch(fetchFormsSuccessNoResults());
    }

    return forms;
  } catch (error) {
    dispatch(
      fetchFormsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );

    return null;
  }
};
