/**
 * Returns file upload data for first item with matching attachmentId
 *
 * @param {Array} data Array of file upload objects
 * @param {String} id String to match when checking the attachmentId property
 * (e.g., 'Front of insurance card')
 * @returns Returns array with first matching file upload object where the
 * `attachmentId` property includes `id`
 */
function getAttachment(data, id) {
  const res = data?.find(a => a.attachmentId?.includes(id));
  return res ? [res] : undefined;
}

function getFront(data) {
  return getAttachment(data, 'Front of');
}

function getBack(data) {
  return getAttachment(data, 'Back of');
}

/**
 * Deletes any properties from the passed-in object that have a value of
 * undefined.
 *
 * @param {Object} obj Object from which to remove undefined properties
 * @returns Copy of obj with undefined properties removed
 */
function removeEmptyKeys(obj) {
  const cleanObject = { ...obj };
  Object.keys(cleanObject).forEach(key => {
    if (cleanObject[key] === undefined) {
      delete cleanObject[key];
    }
  });
  return cleanObject;
}

/**
 * [10-7959c migration version 0 -> 1]
 *
 * Updates the keynames for insurance/medicare card uploads to use
 * designated front/back keynames.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId- current form ID from SIP interface, e.g. '10-7959c'
 * @returns {{formData: object, metadata: object}}
 */
export const migrateCardUploadKeys = ({ formData, metadata, _formId }) => {
  let tmpFormData = JSON.parse(JSON.stringify(formData));

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

  // Remove original keys
  delete tmpFormData.applicantMedicarePartAPartBCard;
  delete tmpFormData.applicantMedicarePartDCard;
  delete tmpFormData.primaryInsuranceCard;
  delete tmpFormData.secondaryInsuranceCard;

  // Apply new keys to form data object
  tmpFormData = { ...tmpFormData, ...removeEmptyKeys(newKeys) };

  return { formData: tmpFormData, metadata };
};
