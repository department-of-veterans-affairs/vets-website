import { isVersion1Data } from '../utils/helpers';

const unaffectedPages = ['/contact-information', '/veteran-information'];

export const forceV2Migration = data => {
  const formData = { ...data };

  // Remove sameOffice
  delete formData.sameOffice;

  // Change time window selection - clear out previous selections
  formData.informalConferenceTimes = {};

  // Change Rep Name format
  const name = formData?.informalConferenceRep?.name;
  if (formData.informalConference === 'rep' && name) {
    // can't split name on a space, e.g. "James P. Sullivan", so we add it to
    // the last name field since the schema allows more characters in the last
    formData.informalConferenceRep.firstName = '';
    formData.informalConferenceRep.lastName = name;
    delete formData.informalConferenceRep.name;
  }

  // Move v1 property to v2 location (temporary)
  formData.veteran.zipCode5 = formData.zipCode5;
  // Remove v1-only property
  delete formData.zipCode5;

  return formData;
};

/* Update to match Lighthouse v2 changes
 * https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json
 * Four modifications need to happen in this migration
 * - [x] Redirect user to contact page if a migration occurs
 * - [x] Remove Same Office selection
 * - [x] Change time window selection
 * - [x] Change Rep Name format
 * - [ ] Add ‘I am Homeless’ flag (required)
 * - [ ] Explicitly take in Rep phone # and email
 * - [ ] Add SOC/SSOC Date field per Issue (only if opting in to AMA)
 * - [ ] Start sending in Veteran Contact Info
 * - [ ] Support write-in Issues - similar to NOD
 */
export default function version2Updates(savedData) {
  const { formData, metadata } = savedData;

  // Only transform data to v2 if feature flag is set. Subsequent saves will
  // update the metadata.version to 2, so we can't rely on that
  if (!isVersion1Data(formData)) {
    return savedData;
  }

  // return to contact info page if this migration needs to be applied
  const returnUrl = unaffectedPages.includes(metadata.returnUrl)
    ? metadata.returnUrl
    : unaffectedPages[0];

  return {
    formData: forceV2Migration(formData),
    metadata: {
      ...metadata,
      version: 2,
      returnUrl,
    },
  };
}
