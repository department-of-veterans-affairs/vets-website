import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';
import { getBack, getFront, removeEmptyKeys } from '../utils/helpers';

export default [
  // 0 -> 1, updates the keynames for insurance/medicare card uploads to use
  // designated front/back keynames.
  ({ formData, metadata }) => {
    let tmpFormData = JSON.parse(JSON.stringify(formData));

    const oldKeys = [
      'applicantMedicarePartAPartBCard',
      'applicantMedicarePartDCard',
      'primaryInsuranceCard',
      'secondaryInsuranceCard',
    ];

    // Map matching old data to new property names
    const newKeys = {
      applicantMedicarePartAPartBCardFront: getFront(
        tmpFormData.applicantMedicarePartAPartBCard,
      ),
      applicantMedicarePartAPartBCardBack: getBack(
        tmpFormData.applicantMedicarePartAPartBCard,
      ),
      applicantMedicarePartDCardFront: getFront(
        tmpFormData.applicantMedicarePartDCard,
      ),
      applicantMedicarePartDCardBack: getBack(
        tmpFormData.applicantMedicarePartDCard,
      ),
      primaryInsuranceCardFront: getFront(tmpFormData.primaryInsuranceCard),
      primaryInsuranceCardBack: getBack(tmpFormData.primaryInsuranceCard),
      secondaryInsuranceCardFront: getFront(tmpFormData.secondaryInsuranceCard),
      secondaryInsuranceCardBack: getBack(tmpFormData.secondaryInsuranceCard),
    };

    // Remove original keys from form data
    oldKeys.forEach(k => delete tmpFormData[k]);

    // Clean out the `missingUploads` array if present
    tmpFormData.missingUploads = tmpFormData.missingUploads?.filter(
      upload => !oldKeys.includes(upload?.name),
    );

    // Delete missingUploads if it's empty or contains only undefined values
    if (
      !tmpFormData.missingUploads ||
      tmpFormData.missingUploads.length === 0 ||
      tmpFormData.missingUploads.every(u => !u)
    ) {
      delete tmpFormData.missingUploads;
    }

    // Apply new keys to form data object
    tmpFormData = { ...tmpFormData, ...removeEmptyKeys(newKeys) };

    return { formData: tmpFormData, metadata };
  },
  // 1 -> 2, updates key name for the benefit status question to a view: field
  ({ formData, metadata }) => {
    let newData = formData;

    if (typeof newData.champvaBenefitStatus !== 'undefined') {
      const value = newData.champvaBenefitStatus;
      newData = unset('champvaBenefitStatus', newData);
      newData = set('view:champvaBenefitStatus', value, newData);
    }

    return { formData: newData, metadata };
  },
];
