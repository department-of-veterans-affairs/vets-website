import * as addressChangeAuthorization from './address-change-authorization';
import * as treatmentDisclosureAuthorization from './treatment-disclosure-authorization';

import { unauthNameAndDob, unauthIdInfo } from './personal-information';

import { unauthContactInfo, unauthMailingAddress } from './contact-information';

const personalInformation = {
  unauthNameAndDob,
  unauthIdInfo,
};

const contactInformation = {
  unauthMailingAddress,
  unauthContactInfo,
};

export {
  personalInformation,
  contactInformation,
  addressChangeAuthorization,
  treatmentDisclosureAuthorization,
};
