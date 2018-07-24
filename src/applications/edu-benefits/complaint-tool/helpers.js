import environment from '../../../platform/utilities/environment';
import _ from 'lodash';

const searchInstitutionBaseUrl = `${environment.API_URL}/v0/gi/institutions/search`;

export function fetchInstitutions({ institutionQuery, url }) {
  const fetchUrl = institutionQuery ? `${searchInstitutionBaseUrl}?name=${institutionQuery}` : url;

  return fetch(fetchUrl, {
    headers: {
      'X-Key-Inflection': 'camel'
    }
  })
    .then(res => res.json())
    .then(
      payload => ({ payload });
      error => ({ error })
    );
}

export function transformInstitutionsForSchoolSelectField({ error, institutionQuery, payload = {}}) {
  if (error) {
    return { error }
  }

  const {
    data = [],
    links,
    meta
  } = payload;

  const institutionCount = meta.count;
  const institutions = data.map(({ attributes }) => {
    const { city, country, facilityCode, name, state, zip } = attributes;

    return { city, country, facilityCode, name, state, zip };
  });

  return {
    institutionCount,
    institutionQuery,
    institutions,
    links
  };
}

