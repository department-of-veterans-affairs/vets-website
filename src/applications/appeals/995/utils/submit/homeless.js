import { livingSituationSubmissionChoices } from '../../content/livingSituation';
import { OTHER_HOUSING_RISK_MAX, POINT_OF_CONTACT_MAX } from '../../constants';
import { REGEXP } from '../../../shared/constants';

import { showScNewForm } from '../toggle';

/* https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/decision_reviews/v2/200995.json#L79-L102

"homeless": { "type": "boolean" },
"homelessLivingSituation": {
  "type": "array",
  "items": {
    "type": "string",
    "enum": [
      "I LIVE OR SLEEP IN A PLACE THAT IS NOT MEANT FOR REGULAR SLEEPING",
      "I LIVE IN A SHELTER",
      "I AM STAYING WITH A FRIEND OR FAMILY MEMBER, BECAUSE I AM UNABLE TO OWN A HOME RIGHT NOW",
      "IN THE NEXT 30 DAYS, I WILL HAVE TO LEAVE A FACILITY, LIKE A HOMELESS SHELTER",
      "IN THE NEXT 30 DAYS, I WILL LOSE MY HOME",
      "NONE OF THESE SITUATIONS APPLY TO ME",
      "OTHER"
    ]
  }
},
"homelessLivingSituationOther": {"type":  "string", "maxLength": 100 },
"homelessPointOfContact": {"type":  "string", "maxLength": 150 },
"homelessPointOfContactPhone": {
  "allOf": [
    { "$ref": "#/definitions/phone" },
    { "$comment": "the phone fields must not exceed 20 chars, when concatenated" }
  ]
},

"phone": {
  "type": "object",
  "properties": {
    "countryCode": { "type": "string", "pattern": "^[0-9]+$", "minLength": 1, "maxLength": 3 },
    "areaCode": { "type": "string", "pattern": "^[0-9]{1,4}$", "minLength": 1, "maxLength": 4 },
    "phoneNumber": { "type": "string", "pattern": "^[0-9]{1,14}$", "minLength": 1, "maxLength": 14 },
    "phoneNumberExt": { "type": "string", "pattern": "^[a-zA-Z0-9]{1,10}$", "minLength": 1, "maxLength": 10 }
  },
  "required": [ "areaCode", "phoneNumber" ]
},
*/
export const getHomeless = formData => {
  const result = {};
  if (showScNewForm(formData)) {
    result.homeless = !!formData.housingRisk;

    if (result.homeless) {
      const livingSituation = Object.entries(formData.livingSituation || {})
        .map(([key, value]) => (value ? key : null))
        .filter(Boolean);
      if (livingSituation.length) {
        result.homelessLivingSituation = livingSituation.map(
          key => livingSituationSubmissionChoices[key],
        );
      }

      const otherHousingRisk = formData.otherHousingRisks || '';
      if (formData.livingSituation?.other && otherHousingRisk) {
        result.homelessLivingSituationOther = otherHousingRisk.substring(
          0,
          OTHER_HOUSING_RISK_MAX,
        );
      }

      const pointOfContact = formData.pointOfContactName || '';
      if (pointOfContact) {
        result.homelessPointOfContact = pointOfContact.substring(
          0,
          POINT_OF_CONTACT_MAX,
        );
      }

      // Max length of international numbers is 15 characters per web component
      // pattern `internationalPhoneSchema`
      // example: '44-20-1234-5678901'
      const phone = (formData.pointOfContactPhone || '').replace(
        REGEXP.NON_DIGIT,
        '',
      );
      if (phone) {
        result.homelessPointOfContactPhone = {
          // Lighthouse combines these values into a string, it doesn't matter how
          // we split it up; or, if we're processing a US or international phone
          // Also, don't submit empty strings
          // countryCode: '',
          // phoneNumberExt: '',
          areaCode: phone.substring(0, 3),
          phoneNumber: phone.substring(3, phone.length),
        };
      }
    }
  }
  return result;
};
