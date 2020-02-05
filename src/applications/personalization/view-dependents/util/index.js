import { apiRequest } from 'platform/utilities/api';

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

export function splitPersons(persons) {
  const onAwardPeeps = [];
  const notOnAwardPeeps = [];
  const allPersons = {};

  persons.map(person => {
    if (person.awardIndicator === 'N') {
      notOnAwardPeeps.push(person);
    } else {
      onAwardPeeps.push(person);
    }
    return true;
  });
  allPersons.onAward = onAwardPeeps;
  allPersons.notOnAward = notOnAwardPeeps;
  return allPersons;
}
