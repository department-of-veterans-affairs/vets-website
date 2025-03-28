import { MST_OPTION } from '../../constants';
import { optionForMstChoices } from '../../content/optionIndicator';

import { showScNewForm } from '../toggle';

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
  if (showScNewForm(formData) && formData[MST_OPTION]) {
    const value = optionForMstChoices[formData.optionIndicator] || '';
    if (value) {
      result.mstUpcomingEventDisclosure = value;
    }
  }
  return result;
};
