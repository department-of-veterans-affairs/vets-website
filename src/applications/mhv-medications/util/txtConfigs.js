import {
  createNoDescriptionText,
  createVAPharmacyText,
  dateFormat,
  getRefillHistory,
  processList,
  validateField,
  validateIfAvailable,
} from './helpers';
import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  nonVAMedicationTypes,
} from './constants';

/**
 * Return Non-VA prescription TXT
 */
export const buildNonVAPrescriptionTXT = prescription => {
  return `
---------------------------------------------------------------------------------


${prescription.prescriptionName ||
    (prescription.dispStatus === 'Active: Non-VA'
      ? prescription.orderableItem
      : '')}

Instructions: ${validateIfAvailable('Instructions', prescription.sig)}

Reason for use: ${validateIfAvailable(
    'Reason for use',
    prescription.indicationForUse,
  )}

Status: ${validateField(prescription.dispStatus?.toString())}
A VA provider added this medication record in your VA medical records. But this isn't a prescription you filled through a VA pharmacy. You can't request refills or manage this medication through this online tool.
Non-VA medications include these types:
${nonVAMedicationTypes}

When you started taking this medication: ${dateFormat(
    prescription.dispensedDate,
    'MMMM D, YYYY',
    'Date not available',
  )}

Documented by: ${
    prescription.providerLastName
      ? `${prescription.providerLastName}, ${prescription.providerFirstName ||
          ''}`
      : 'Provider name not available'
  }

Documented at this facility: ${validateIfAvailable(
    'Facility',
    prescription.facilityName,
  )}

Provider notes: ${validateField(
    (prescription.remarks ?? '') +
      (prescription.disclaimer ? ` ${prescription.disclaimer}` : ''),
  )}


---------------------------------------------------------------------------------

  `;
};

/**
 * Return prescriptions list TXT
 */
export const buildPrescriptionsTXT = prescriptions => {
  let result = `
---------------------------------------------------------------------------------

  `;

  prescriptions?.forEach(rx => {
    if (rx?.prescriptionSource === 'NV') {
      result += buildNonVAPrescriptionTXT(rx).slice(84);
      return;
    }

    result += `
${rx.prescriptionName}

About your prescription

Last filled on: ${dateFormat(
      rx.sortedDispensedDate,
      'MMMM D, YYYY',
      'Date not available',
    )}

Prescription number: ${rx.prescriptionNumber}

Status: ${validateField(rx.dispStatus)}
${(pdfStatusDefinitions[rx.refillStatus] || pdfDefaultStatusDefinition).reduce(
      (fullStatus, item) =>
        fullStatus + item.value + (item.continued ? ' ' : '\n'),
      '',
    )}
Refills left: ${validateIfAvailable(
      'Number of refills left',
      rx.refillRemaining,
    )}

Request refills by this prescription expiration date: ${dateFormat(
      rx.expirationDate,
      'MMMM D, YYYY',
      'Date not available',
    )}

Facility: ${validateIfAvailable('Facility', rx.facilityName)}

Pharmacy phone number: ${validateIfAvailable(
      'Pharmacy phone number',
      rx.phoneNumber,
    )}

Instructions: ${validateIfAvailable('Instructions', rx.sig)}

Reason for use: ${validateIfAvailable('Reason for use', rx.indicationForUse)}

Quantity: ${validateIfAvailable('Quantity', rx.quantity)}

Prescribed on: ${dateFormat(
      rx.orderedDate,
      'MMMM D, YYYY',
      'Date not available',
    )}

Prescribed by: ${(rx.providerFirstName && rx.providerLastName) ||
      'Provider name not available'}

${
      rx.groupedMedications?.length > 0
        ? `Previous prescriptions associated with this medication: ${rx.groupedMedications
            .map(previousRx => {
              return previousRx.prescriptionNumber;
            })
            .join(', ')}
`
        : ``
    }`;
  });

  return result;
};

/**
 * Return allergies TXT
 */
export const buildAllergiesTXT = allergies => {
  if (!allergies) {
    return '\nAllergies\n\nWe couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.\n';
  }

  if (allergies && allergies.length === 0) {
    return '\nAllergies\n\nThere are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.\n';
  }

  let result = `
---------------------------------------------------------------------------------

Allergies

This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.

Showing ${allergies.length} records from newest to oldest

  `;

  allergies.forEach(item => {
    result += `
${item.name}

Date entered: ${item.date || 'Not available'}

Signs and symptoms: ${processList(item.reaction, 'Not available')}

Type of allergy: ${item.type || 'Not available'}

Location: ${item.location || 'Not available'}

Observed or historical: ${item.observedOrReported || 'Not available'}

Provider notes: ${validateField(item.notes)}

    `;
  });

  return result;
};

/**
 * Return VA prescription TXT
 */
export const buildVAPrescriptionTXT = prescription => {
  const refillHistory = getRefillHistory(prescription);
  let result = `
---------------------------------------------------------------------------------


${prescription?.prescriptionName ||
    (prescription?.dispStatus === 'Active: Non-VA'
      ? prescription?.orderableItem
      : '')}


Most recent prescription


Last filled on: ${dateFormat(
    prescription.sortedDispensedDate,
    'MMMM D, YYYY',
    'Date not available',
  )}

Prescription number: ${prescription.prescriptionNumber}

Status: ${validateField(prescription.dispStatus)}
${(
    pdfStatusDefinitions[prescription.refillStatus] ||
    pdfDefaultStatusDefinition
  ).reduce(
    (fullStatus, item) =>
      fullStatus + item.value + (item.continued ? ' ' : '\n'),
    '',
  )}
Refills left: ${validateIfAvailable(
    'Number of refills left',
    prescription.refillRemaining,
  )}

Request refills by this prescription expiration date: ${dateFormat(
    prescription.expirationDate,
    'MMMM D, YYYY',
    'Date not available',
  )}

Facility: ${validateIfAvailable('Facility', prescription.facilityName)}

Pharmacy phone number: ${validateIfAvailable(
    'Pharmacy phone number',
    prescription.phoneNumber,
  )}

Instructions: ${validateIfAvailable('Instructions', prescription.sig)}

Reason for use: ${validateIfAvailable(
    'Reason for use',
    prescription.indicationForUse,
  )}

Quantity: ${validateIfAvailable('Quantity', prescription.quantity)}

Prescribed on: ${dateFormat(
    prescription.orderedDate,
    'MMMM D, YYYY',
    'Date not available',
  )}

Prescribed by: ${(prescription.providerFirstName &&
    prescription.providerLastName) ||
    'Provider name not available'}


Refill history

Showing ${refillHistory.length} refill${
    refillHistory.length > 1 ? 's, from newest to oldest' : ''
  }

  `;

  refillHistory.forEach((entry, i) => {
    const phone = entry.cmopDivisionPhone || entry.dialCmopDivisionPhone;
    const { shape, color, backImprint, frontImprint } = entry;
    const hasValidDesc = shape?.trim() && color?.trim() && frontImprint?.trim();
    const index = refillHistory.length - i - 1;
    const description = hasValidDesc
      ? `
Note: If the medication you’re taking doesn’t match this description, call ${createVAPharmacyText(
          phone,
        )}

* Shape: ${shape[0].toUpperCase()}${shape.slice(1).toLowerCase()}
* Color: ${color[0].toUpperCase()}${color.slice(1).toLowerCase()}
* Front marking: ${frontImprint}
${backImprint ? `* Back marking: ${backImprint}` : ''}`
      : createNoDescriptionText(phone);
    result += `
${index === 0 ? 'Original fill' : `Refill`}: ${dateFormat(
      entry.dispensedDate,
      'MMMM D, YYYY',
      'Date not available',
    )}
${
      i === 0
        ? `
Shipped on: ${dateFormat(
            prescription?.trackingList?.[0]?.completeDateTime,
            'MMMM D, YYYY',
            'Date not available',
          )}
`
        : ``
    }
Medication description: ${description}

    `;
  });

  if (prescription?.groupedMedications?.length > 0) {
    result += `
Previous prescriptions

Showing ${prescription.groupedMedications.length} prescription${
      prescription.groupedMedications.length > 1
        ? 's, from newest to oldest'
        : ''
    }
    `;

    prescription.groupedMedications.forEach(previousPrescription => {
      result += `

Prescription number: ${previousPrescription.prescriptionNumber}

Last filled: ${dateFormat(
        previousPrescription.sortedDispensedDate,
        'MMMM D, YYYY',
        'Date not available',
      )}

Quantity: ${validateIfAvailable('Quantity', previousPrescription.quantity)}

Prescribed on: ${dateFormat(
        previousPrescription.orderedDate,
        'MMMM D, YYYY',
        'Date not available',
      )}

Prescribed by: ${(previousPrescription.providerFirstName &&
        previousPrescription.providerLastName) ||
        'Provider name not available'}
      `;
    });
  }

  return result;
};
