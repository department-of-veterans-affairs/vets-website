import { facilityTypeSubmissionChoices } from '../../content/facilityTypes';
import { TREATMENT_FACILITY_OTHER_MAX } from '../../constants';

import { showScNewForm } from '../toggle';

/* https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/decision_reviews/v2/200995.json#L151-L166

"treatmentLocations":{
  "type": "array",
  "description": "Identify where you have received treatment",
  "items": {
    "type": "string",
    "enum": [
      "PRIVATE HEALTH CARE PROVIDER",
      "VA VET CENTER",
      "COMMUNITY CARE",
      "VA MEDICAL CENTERS (VAMC) AND COMMUNITY-BASED OUTPATIENT CLINICS (CBOC)",
      "DEPARTMENT OF DEFENSE (DOD) MILITARY TREATMENT FACILITY(IES) (MTF)",
      "OTHER"
    ]
  },
  "treatmentLocationOther": {"type":  "string", "maxLength": 115 }
},
*/
export const getFacilityType = formData => {
  const result = {};
  if (showScNewForm(formData)) {
    const locations = Object.entries(formData.facilityTypes || {})
      .reduce((acc, [key, value]) => {
        if (value) {
          if (['vamc', 'cboc'].includes(key)) {
            acc.push(facilityTypeSubmissionChoices.vamcCobc);
          } else if (key === 'other') {
            result.treatmentLocationOther = formData.facilityTypes.other.substring(
              0,
              TREATMENT_FACILITY_OTHER_MAX,
            );
          }
          acc.push(facilityTypeSubmissionChoices[key]);
        }
        return acc;
      }, [])
      .filter(Boolean);
    if (locations.length) {
      // Remove duplicates (vamc and cboc are combined)
      result.treatmentLocations = [...new Set(locations)];
    }
    return result;
  }
  return null;
};
