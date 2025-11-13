import { optionForMstChoices } from '../../content/optionIndicator';
import { hasMstOption } from '../form-data-retrieval';

/*

"mstUpcomingEventDisclosure": {
  "description": "Allows the Claimant to indicate their consent for VBA to communicate with VHA regarding upcoming events related to the appeals process.",
  "type": "string",
  "enum": [
    "I CONSENT",
    "I DO NOT CONSENT",
    "I REVOKE PRIOR CONSENT",
    "NOT APPLICABLE AND/OR NOT ENROLLED IN VHA HEALTHCARE"
  ]
},
*/
export const getMstData = formData => {
  const result = {};

  if (hasMstOption(formData)) {
    const value = optionForMstChoices?.[formData.optionIndicator] || '';

    if (value) {
      result.mstUpcomingEventDisclosure = value;
    }
  }

  return result;
};
