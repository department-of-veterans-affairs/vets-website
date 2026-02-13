import React from 'react';

export const evidenceRequestAdditionalInfo = (
  <va-additional-info trigger="The differences between VA and private medical centers">
    <p>
      <strong>VA medical centers</strong> include VA medical centers or clinics,
      as well as doctors through the TRICARE health care program.
    </p>
    <p>
      <strong>Private medical centers</strong> include private doctors, such as
      Veterans Choice doctor. You can also choose to upload copies of your
      medical records instead of giving us permission to request them.
    </p>
  </va-additional-info>
);

export const evidenceRequestQuestion = {
  label:
    'Are there medical records related to your claim that you’d like us to access on your behalf from VA or private medical centers?',
  hint:
    'If you select “Yes,” we’ll request these records from VA or private medical centers. Or you can upload copies of your private medical records.',
};

export const vaEvidenceContent = (
  <p>
    You can choose not to submit medical records to support your claim. If you
    do so, we’ll remove the information you shared about these VA medical
    centers:
  </p>
);

export const privateEvidenceContent = (
  <p>
    We’ll also delete these medical records you uploaded related to your claimed
    conditions:
  </p>
);

export const privateFacilityContent = (
  <p>
    You can choose not to submit medical records to support your claim. If you
    do so, we’ll remove the information you shared about these private medical
    centers:
  </p>
);

export const alertMessageForCentersAndFiles =
  'We’ve removed information about your medical centers and deleted the medical records you uploaded from this claim.';

export const alertMessageForCenters =
  'We’ve removed information about your medical centers from this claim.';

export const alertMessageForFiles =
  'We’ve deleted the medical records you uploaded from this claim.';

export const alertMessage = alertType => {
  if (
    alertType.includes('privateMedicalRecords') &&
    (alertType.includes('va') || alertType.includes('privateFacility'))
  ) {
    return alertMessageForCentersAndFiles;
  }
  if (
    (alertType.includes('va') || alertType.includes('privateFacility')) &&
    !alertType.includes('privateMedicalRecords')
  ) {
    return alertMessageForCenters;
  }
  if (
    alertType.includes('privateMedicalRecords') &&
    !alertType.includes('va') &&
    !alertType.includes('privateFacility')
  ) {
    return alertMessageForFiles;
  }
  return '';
};
const maxDisplayedItems = 3;
export const renderFacilityList = (facilities, nameKey) => {
  const showAll = facilities.length <= maxDisplayedItems + 1;
  const displayList = showAll
    ? facilities
    : facilities.slice(0, maxDisplayedItems);
  return (
    <ul>
      {displayList.map((facility, index) => (
        <li key={index}>
          {facility[nameKey] || 'Name of medical center wasn’t added'}
        </li>
      ))}
      {!showAll && (
        <li>{facilities.length - maxDisplayedItems} other medical centers</li>
      )}
    </ul>
  );
};

export const renderFileList = files => {
  const showAll = files.length <= maxDisplayedItems + 1;
  const displayList = showAll ? files : files.slice(0, maxDisplayedItems);
  return (
    <ul>
      {displayList.slice(0, maxDisplayedItems).map((file, index) => (
        <li key={index}>{file.name}</li>
      ))}

      {!showAll && (
        <li>{files.length - maxDisplayedItems} other medical records</li>
      )}
    </ul>
  );
};

export const missingSelectionErrorMessageEvidenceRequestPage =
  'You must provide a response';

export const missingSelectionErrorMessageMedicalRecordPage =
  'Select at least one type of medical record';

export const medicalRecordQuestion =
  'What types of medical records would you like us to access on your behalf?';
