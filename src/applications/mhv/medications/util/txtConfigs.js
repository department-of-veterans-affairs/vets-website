import { processList } from '../../medical-records/util/helpers';
import { dateFormat, validateField } from './helpers';
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

Instructions: ${validateField(prescription.sig)}

Reason for use: ${validateField(prescription.indicationForUse)}

Status: ${validateField(prescription.dispStatus?.toString())}
A VA provider added this medication record in your VA medical records. But this isn't a prescription you filled through a VA pharmacy. You can't request refills or manage this medication through this online tool.
Non-VA medications include these types:
${nonVAMedicationTypes}

When you started taking this medication: ${dateFormat(
    prescription.dispensedDate,
    'MMMM D, YYYY',
  )}

Documented by: ${
    prescription.providerLastName
      ? `${prescription.providerLastName}, ${prescription.providerFirstName ||
          ''}`
      : 'None noted'
  }

Documented at this facility: ${validateField(prescription.facilityName)}

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

Last filled on: ${dateFormat(rx.dispensedDate, 'MMMM D, YYYY')}

Status: ${validateField(rx.dispStatus)}
${(pdfStatusDefinitions[rx.refillStatus] || pdfDefaultStatusDefinition).reduce(
      (fullStatus, item) =>
        fullStatus + item.value + (item.continued ? ' ' : '\n'),
      '',
    )}
Refills left: ${validateField(rx.refillRemaining)}

Request refills by this prescription expiration date: ${dateFormat(
      rx.expirationDate,
      'MMMM D, YYYY',
    )}

Prescription number: ${rx.prescriptionNumber}

Prescribed on: ${dateFormat(rx.orderedDate, 'MMMM D, YYYY')}

Prescribed by: ${(rx.providerFirstName && rx.providerLastName) || 'None noted'}

Facility: ${validateField(rx.facilityName)}

Pharmacy phone number: ${validateField(rx.phoneNumber)}

Instructions: ${validateField(rx.sig)}

Reason for use: ${validateField(rx.indicationForUse)}

Quantity: ${validateField(rx.quantity)}


---------------------------------------------------------------------------------

    `;
  });

  return result;
};

/**
 * Return allergies TXT
 */
export const buildAllergiesTXT = allergies => {
  if (!allergies) {
    return '\nWe couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, email us at vamhvfeedback@va.gov.\n';
  }

  if (allergies && allergies.length === 0) {
    return '\nThere are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.\n';
  }

  let result = `
Allergies

This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.

Showing ${allergies.length} records from newest to oldest

  `;

  allergies.forEach(item => {
    result += `
${item.name}

Date entered: ${validateField(item.date)}

Signs and symptoms: ${processList(item.reaction)}

Type of allergy: ${validateField(item.type)}

Location: ${validateField(item.location)}

Observed or historical: ${validateField(item.observedOrReported)}

Provider notes: ${validateField(item.notes)}


---------------------------------------------------------------------------------

    `;
  });

  return result;
};

/**
 * Return VA prescription TXT
 */
export const buildVAPrescriptionTXT = prescription => {
  const refillHistory = [...(prescription?.rxRfRecords?.[0]?.[1] || [])];
  refillHistory.push({
    prescriptionName: prescription?.prescriptionName,
    dispensedDate: prescription?.dispensedDate,
    cmopNdcNumber: prescription?.cmopNdcNumber,
    id: prescription?.prescriptionId,
  });

  let result = `
---------------------------------------------------------------------------------


${prescription?.prescriptionName ||
    (prescription?.dispStatus === 'Active: Non-VA'
      ? prescription?.orderableItem
      : '')}


About your prescription


Last filled on: ${dateFormat(
    (prescription.rxRfRecords?.length &&
      prescription.rxRfRecords?.[0]?.[1].dispensedDate) ||
      prescription.dispensedDate,
    'MMMM D, YYYY',
  )}

Status: ${validateField(prescription.dispStatus)}
${(
    pdfStatusDefinitions[prescription.refillStatus] ||
    pdfDefaultStatusDefinition
  ).reduce(
    (fullStatus, item) =>
      fullStatus + item.value + (item.continued ? ' ' : '\n'),
    '',
  )}
Refills left: ${validateField(prescription.refillRemaining)}

Request refills by this prescription expiration date: ${dateFormat(
    prescription.expirationDate,
    'MMMM D, YYYY',
  )}

Prescription number: ${prescription.prescriptionNumber}

Prescribed on: ${dateFormat(prescription.orderedDate, 'MMMM D, YYYY')}

Prescribed by: ${(prescription.providerFirstName &&
    prescription.providerLastName) ||
    'None noted'}

Facility: ${validateField(prescription.facilityName)}

Pharmacy phone number: ${validateField(prescription.phoneNumber)}


About this medication or supply


Instructions: ${validateField(prescription.sig)}

Reason for use: ${validateField(prescription.indicationForUse)}

Quantity: ${validateField(prescription.quantity)}


Refill history

  `;

  refillHistory.forEach((entry, i) => {
    result += `
${i === 0 ? 'First fill' : `Refill ${i}`}

Filled by pharmacy on: ${
      entry?.dispensedDate ? dateFormat(entry.dispensedDate) : 'None noted'
    }

Shipped on: ${
      entry?.trackingList?.[0]?.[1]?.completeDateTime
        ? dateFormat(entry.trackingList[0][1].completeDateTime)
        : 'None noted'
    }


---------------------------------------------------------------------------------

    `;
  });

  return result;
};
