import * as addressChangeAuthorization from './address-change-authorization';
import * as treatmentDisclosureAuthorization from './treatment-disclosure-authorization';

import {
  unauthContactInfo,
  unauthIdInfo,
  unauthMailingAddress,
  unauthNameAndDob,
} from './veteran-personal-information';

const personalInformation = {
  unauthContactInfo,
  unauthIdInfo,
  unauthMailingAddress,
  unauthNameAndDob,
};

export {
  addressChangeAuthorization,
  treatmentDisclosureAuthorization,
  personalInformation,
};
