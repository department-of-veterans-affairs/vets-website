import { apiRequest } from '../../../platform/utilities/api';
import appendQuery from 'append-query';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function fetchInstitutions({ institutionQuery, page }) {
  const fetchUrl = appendQuery('/gi/institutions/search', {
    name: institutionQuery,
    page
  });

  return apiRequest(
    fetchUrl,
    null,
    payload => ({ payload }),
    error => ({ error }));
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}
