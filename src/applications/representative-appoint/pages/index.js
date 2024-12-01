import * as authorizeMedical from './authorizations/authorizeMedical';
import * as authorizeMedicalSelect from './authorizations/authorizeMedicalSelect';
import * as authorizeAddress from './authorizations/authorizeAddress';
import * as authorizeInsideVA from './authorizations/authorizeInsideVA';
import * as authorizeOutsideVA from './authorizations/authorizeOutsideVA';
import * as authorizeOutsideVANames from './authorizations/authorizeOutsideVANames';
import * as claimantType from './claimant/claimantType';
import * as claimantContactPhoneEmail from './claimant/claimantContactPhoneEmail';
import * as claimantRelationship from './claimant/claimantRelationship';
import * as claimantPersonalInformation from './claimant/claimantPersonalInformation';
import * as confirmClaimantPersonalInformation from './claimant/confirmClaimantPersonalInformation';
import * as claimantContactMailing from './claimant/claimantContactMailing';
import * as veteranPersonalInformation from './veteran/veteranPersonalInformation';
import * as veteranContactPhoneEmail from './veteran/veteranContactPhoneEmail';
import * as veteranContactPhoneEmailForNonVeteran from './veteran/veteranContactPhoneEmailForNonVeteran';
import * as veteranContactMailing from './veteran/veteranContactMailing';
import * as veteranContactMailingClaimant from './veteran/veteranContactMailingClaimant';
import * as veteranIdentification from './veteran/veteranIdentification';
import * as veteranServiceInformation from './veteran/veteranServiceInformation';
import * as selectAccreditedRepresentative from './representative/selectAccreditedRepresentative';
import * as replaceAccreditedRepresentative from './representative/replaceAccreditedRepresentative';
import * as selectedAccreditedOrganizationId from './representative/selectAccreditedOrganization';
import * as contactAccreditedRepresentative from './representative/contactAccreditedRepresentative';

export {
  authorizeMedical,
  authorizeMedicalSelect,
  authorizeAddress,
  authorizeInsideVA,
  authorizeOutsideVA,
  authorizeOutsideVANames,
  claimantType,
  claimantContactPhoneEmail,
  claimantRelationship,
  claimantPersonalInformation,
  confirmClaimantPersonalInformation,
  claimantContactMailing,
  veteranPersonalInformation,
  veteranContactPhoneEmail,
  veteranContactPhoneEmailForNonVeteran,
  veteranContactMailing,
  veteranContactMailingClaimant,
  veteranIdentification,
  veteranServiceInformation,
  selectAccreditedRepresentative,
  replaceAccreditedRepresentative,
  selectedAccreditedOrganizationId,
  contactAccreditedRepresentative,
};
