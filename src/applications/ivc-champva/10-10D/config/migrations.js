/**
 * [10-10d migration version 0 -> 1]
 *
 * Flattens SSN/VA File Number object info down to a single string on items in
 * the applicants array.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId- current form ID from SIP interface, e.g. '10-10D'
 * @returns {{formData: object, metadata: object}}
 */
export const flattenApplicantSSN = ({ formData, metadata, _formId }) => {
  formData.applicants?.forEach(app => {
    const tmpApp = app; // Changes will be set directly on `formData`
    if (typeof app.applicantSSN === 'object') {
      // Flatten SSN object to a string:
      tmpApp.applicantSSN =
        app.applicantSSN?.ssn || app.applicantSSN?.vaFileNumber || '';
    }
  });
  return { formData, metadata };
};

/**
 * Returns file upload data for the first item with a matching attachmentId.
 *
 * @param {Array} data Array of file upload objects
 * @param {String} id String to match when checking the attachmentId property
 * @returns {Array|undefined} Returns array with the first matching file upload object or undefined
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
 * Deletes any properties from the passed-in object that have a value of undefined.
 *
 * @param {Object} obj Object from which to remove undefined properties
 * @returns {Object} Copy of obj with undefined properties removed
 */
function removeEmptyKeys(obj) {
  const cleanObject = { ...obj };
  const keysToRemove = [];
  Object.keys(cleanObject).forEach(key => {
    if (cleanObject[key] === undefined) {
      keysToRemove.push(key);
    }
  });
  keysToRemove.forEach(key => delete cleanObject[key]);
  return cleanObject;
}

/**
 * [10-10D migration version 1 -> 2]
 *
 * Updates the keynames for Medicare Part A/B, Medicare Part D, and OHI card uploads
 * to use designated front/back keynames.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId - current form ID from SIP interface, e.g. '10-10D'
 * @returns {{formData: object, metadata: object}}
 */
export const migrateCardUploadKeys = ({ formData, metadata, _formId }) => {
  let tmpFormData = JSON.parse(JSON.stringify(formData));

  const oldKeys = [
    'applicantMedicarePartAPartBCard',
    'applicantMedicarePartDCard',
    'applicantOhiCard',
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
    applicantOhiCardFront: getFront(tmpFormData.applicantOhiCard),
    applicantOhiCardBack: getBack(tmpFormData.applicantOhiCard),
  };

  // Remove original keys from form data
  oldKeys.forEach(k => delete tmpFormData[k]);

  // Clean out the `missingUploads` array if present
  tmpFormData.missingUploads = tmpFormData.missingUploads?.filter(
    upload => !oldKeys.includes(upload?.name),
  );

  // Apply new keys to form data object
  tmpFormData = { ...tmpFormData, ...removeEmptyKeys(newKeys) };

  return { formData: tmpFormData, metadata };
};

/**
 * [10-10d migration version 2 -> 3]
 *
 * Removes applicant relationship to sponsor values if they were previously set
 * to "other", as that is not supported downstream in the VES system that will
 * receive these applications.
 *
 * Since much of the form's conditional flow depends on this property, this
 * migration just blows away the prior setting so that the user is directed to
 * choose a valid option and then correct any dependent pages down the line.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId- current form ID from SIP interface, e.g. '10-10D'
 * @returns {{formData: object, metadata: object}}
 */
export const removeOtherRelationshipSpecification = ({
  formData,
  metadata,
  _formId,
}) => {
  formData.applicants?.forEach(app => {
    const tmpApp = app; // Changes will be set directly on `formData`
    if (
      app?.applicantRelationshipToSponsor?.relationshipToVeteran === 'other'
    ) {
      // Removes both nested properties 'relationshipToVeteran' and
      // 'otherRelationshipToVeteran' to trigger a validation error
      // so the user knows to choose a valid option.
      delete tmpApp.applicantRelationshipToSponsor;
    }
  });
  return { formData, metadata };
};

/**
 * [10-10d migration version 3 -> 4]
 *
 * Flattens SSN/VA File Number object info down to a single string on the sponsor.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId- current form ID from SIP interface, e.g. '10-10D'
 * @returns {{formData: object, metadata: object}}
 */
export const flattenSponsorSSN = ({ formData, metadata, _formId }) => {
  const tmpFormData = formData; // changes will apply directly to formData
  if (typeof tmpFormData?.ssn === 'object') {
    // Flatten SSN object to a string:
    tmpFormData.ssn =
      tmpFormData?.ssn?.ssn || tmpFormData?.ssn?.vaFileNumber || '';
  }
  return { formData, metadata };
};
