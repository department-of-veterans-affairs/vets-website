import environment from '../../../platform/utilities/environment';
import appendQuery from 'append-query';

const searchInstitutionBaseUrl = `${environment.API_URL}/v0/gi/institutions/search`;

export function fetchInstitutions({ institutionQuery, page }) {
  // const fetchUrl = institutionQuery ? `${searchInstitutionBaseUrl}?name=${institutionQuery}` : url;
  const fetchUrl = appendQuery(searchInstitutionBaseUrl, {
    name: institutionQuery,
    page
  });

  return fetch(fetchUrl, {
    headers: {
      'X-Key-Inflection': 'camel'
    }
  })
    .then(res => res.json())
    .then(
      payload => ({ payload }),
      error => ({ error })
    );
}

export function transformInstitutionsForSchoolSelectField({ error, institutionQuery, payload = {} }) {
  if (error) {
    return { error };
  }

  const {
    data = [],
    meta
  } = payload;

  const institutionCount = meta.count;
  const pagesCount = Math.ceil(institutionCount / 10);
  const institutions = data.map(({ attributes }) => {
    const { city, country, facilityCode, name, state, zip } = attributes;

    return { city, country, facilityCode, name, state, zip };
  });

  return {
    institutionCount,
    institutionQuery,
    institutions,
    pagesCount
  };
}

