import {
  createNoDescriptionText,
  createVAPharmacyText,
  dateFormat,
  determineRefillLabel,
  displayProviderName,
  getMostRecentRxRefill,
  getRefillHistory,
  getShowRefillHistory,
  processList,
  validateField,
  validateIfAvailable,
  prescriptionMedAndRenewalStatus,
} from './helpers';
import { FIELD_NOT_AVAILABLE, medStatusDisplayTypes } from './constants';

const newLine = (n = 1) => '\n'.repeat(n);
const joinLines = (...lines) => lines.filter(Boolean).join(newLine(2));
const joinBlocks = (...blocks) =>
  blocks
    .filter(Boolean)
    .map(b => b.trimEnd())
    .join(newLine(2)) + newLine();
const fieldLine = (label, value) =>
  `${label}: ${validateIfAvailable(label, value)}`;
const SEPARATOR =
  '---------------------------------------------------------------------------------';
const getLastFilledAndRxNumberBlock = rx => {
  const pendingMed =
    rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'NewOrder';
  const pendingRenewal =
    rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'Renew';
  const isRxPending = pendingMed || pendingRenewal;

  return isRxPending
    ? ''
    : joinLines(
        `Last filled on: ${dateFormat(
          rx.sortedDispensedDate,
          'MMMM D, YYYY',
          'Date not available',
        )}`,
        `Prescription number: ${rx.prescriptionNumber}`,
      );
};
const getAttributes = rx =>
  joinLines(
    `Status: ${prescriptionMedAndRenewalStatus(rx, medStatusDisplayTypes.TXT)}`,
    fieldLine('Refills left', rx.refillRemaining),
    `Request refills by this prescription expiration date: ${dateFormat(
      rx.expirationDate,
      'MMMM D, YYYY',
      'Date not available',
    )}`,
    fieldLine('Facility', rx.facilityName),
    fieldLine('Pharmacy phone number', rx.phoneNumber),
    fieldLine('Instructions', rx.sig),
    fieldLine('Reason for use', rx.indicationForUse),
    fieldLine('Quantity', rx.quantity),
    `Prescribed on: ${dateFormat(
      rx.orderedDate,
      'MMMM D, YYYY',
      'Date not available',
    )}`,
    `Prescribed by: ${displayProviderName(
      rx.providerFirstName,
      rx.providerLastName,
    )}`,
  );

/**
 * Return Non-VA prescription TXT
 */
export const buildNonVAPrescriptionTXT = (prescription, options) => {
  const { includeSeparators = true } = options ?? {};
  const header = includeSeparators
    ? `${newLine()}${SEPARATOR}${newLine(3)}`
    : '';

  const body = joinBlocks(
    prescription?.prescriptionName || prescription?.orderableItem,
    joinLines(
      fieldLine('Instructions', prescription.sig),
      fieldLine('Reason for use', prescription.indicationForUse),
      `Status: ${validateField(
        prescription.dispStatus?.toString(),
      )}${newLine()}A VA provider added this medication record in your VA medical records. But this isn’t a prescription you filled through a VA pharmacy. This could be sample medications, over-the-counter medications, supplements or herbal remedies. You can’t request refills or manage this medication through this online tool. If you aren't taking this medication, ask your provider to remove it at your next appointment.`,
    ),
    joinLines(
      `When you started taking this medication: ${dateFormat(
        prescription.dispensedDate,
        'MMMM D, YYYY',
        'Date not available',
      )}`,
      `Documented by: ${
        prescription.providerLastName
          ? `${
              prescription.providerLastName
            }, ${prescription.providerFirstName || ''}`
          : 'Provider name not available'
      }`,
      fieldLine('Documented at this facility', prescription.facilityName),
    ),
  );

  return `${header}${body}${newLine()}`;
};

/**
 * Return prescriptions list TXT
 */
export const buildPrescriptionsTXT = prescriptions => {
  const mostRecentRxRefillLine = rx => {
    const newest = getMostRecentRxRefill(rx);

    if (!newest) return '';

    const filledDate = dateFormat(
      newest.sortedDispensedDate,
      'MMMM D, YYYY',
      'Date not available',
    );

    return `Most recent prescription associated with this medication: ${
      newest.prescriptionNumber
    }, last filled on ${filledDate}`;
  };
  const header = `${newLine()}${SEPARATOR}${newLine(3)}`;

  const body = (prescriptions || []).map(rx => {
    if (rx?.prescriptionSource === 'NV') {
      return buildNonVAPrescriptionTXT(rx, {
        includeSeparators: false,
      }).trimEnd();
    }

    const title = rx.prescriptionName;
    const mostRecent = mostRecentRxRefillLine(rx);

    return joinBlocks(
      title,
      getLastFilledAndRxNumberBlock(rx),
      getAttributes(rx),
      mostRecent,
    ).trimEnd();
  });

  return `${header}${body.join(newLine(3))}${newLine(2)}`;
};

/**
 * Return allergies TXT
 */
export const buildAllergiesTXT = allergies => {
  if (!allergies) {
    return `${newLine(2)}Allergies and reactions${newLine(
      2,
    )}We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.${newLine()}`;
  }

  if (allergies && allergies.length === 0) {
    return `${newLine(2)}Allergies and reactions${newLine(
      2,
    )}There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.${newLine()}`;
  }

  const header = `${newLine()}${SEPARATOR}${newLine(3)}`;
  const footer = `${newLine(2)}${SEPARATOR}${newLine()}`;

  const body = joinBlocks(
    'Allergies and reactions',
    'This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
    `Showing ${allergies.length} ${
      allergies.length === 1 ? 'record' : 'records from newest to oldest'
    }`,
  ).trimEnd();

  const items = allergies
    .map(item =>
      joinBlocks(
        newLine(),
        item.name,
        joinLines(
          `Signs and symptoms: ${processList(
            item.reaction,
            FIELD_NOT_AVAILABLE,
          )}`,
          `Type of allergy: ${item.type}`,
          `Observed or historical: ${item.observedOrReported}`,
        ),
      ).trimEnd(),
    )
    .join(newLine());

  return `${header}${body}${newLine()}${items}${newLine()}${footer}`;
};

/**
 * Return VA prescription TXT
 */
export const buildVAPrescriptionTXT = prescription => {
  const header = `${newLine()}${SEPARATOR}${newLine(3)}`;
  const rxTitle = prescription?.prescriptionName || prescription?.orderableItem;
  const subTitle = `Most recent prescription`;

  const mostRecentRxSection = joinLines(
    `${rxTitle}${newLine()}`,
    `${subTitle}${newLine()}`,
    getLastFilledAndRxNumberBlock(prescription),
    getAttributes(prescription),
  ).trimEnd();

  let refillHistorySection = '';
  const refillHistory = getRefillHistory(prescription);
  const showRefillHistory = getShowRefillHistory(refillHistory);
  if (showRefillHistory) {
    const refillHistoryHeader = joinLines(
      'Refill history',
      `Showing ${refillHistory.length} fill${
        refillHistory.length > 1 ? 's, from newest to oldest' : ''
      }`,
    ).trimEnd();

    const refillHistoryRecords = refillHistory
      .map((record, i) => {
        const phone = record.cmopDivisionPhone || record.dialCmopDivisionPhone;
        const { shape, color, backImprint, frontImprint } = record;
        const hasValidDesc =
          shape?.trim() && color?.trim() && frontImprint?.trim();
        const isPartialFill = record.prescriptionSource === 'PF';
        const refillLabel = determineRefillLabel(
          isPartialFill,
          refillHistory,
          i,
        );
        const description = hasValidDesc
          ? `${newLine()}Note: If the medication you’re taking doesn’t match this description, call ${createVAPharmacyText(
              phone,
            )}
* Shape: ${shape[0].toUpperCase()}${shape.slice(1).toLowerCase()}
* Color: ${color[0].toUpperCase()}${color.slice(1).toLowerCase()}
* Front marking: ${frontImprint}
${backImprint ? `* Back marking: ${backImprint}` : ''}${newLine()}`
          : createNoDescriptionText(phone);

        return joinBlocks(
          `${refillLabel}: ${dateFormat(
            record.dispensedDate,
            'MMMM D, YYYY',
            'Date not available',
          )}`,
          isPartialFill
            ? joinLines(
                'This fill has a smaller quantity on purpose.',
                `Quantity: ${record.quantity}`,
              )
            : '',
          i === 0 && !isPartialFill
            ? `Shipped on: ${dateFormat(
                prescription?.trackingList?.[0]?.completeDateTime,
                'MMMM D, YYYY',
                'Date not available',
              )}`
            : '',
          !isPartialFill ? `Medication description: ${description}` : '',
        );
      })
      .join(newLine(2));

    refillHistorySection = `${refillHistoryHeader}${newLine(
      3,
    )}${refillHistoryRecords}`;
  }

  let previousRxSection = '';
  if (prescription?.groupedMedications?.length > 0) {
    const previousRxHeader = joinBlocks(
      newLine(),
      'Previous prescriptions',
      `Showing ${prescription.groupedMedications.length} prescription${
        prescription.groupedMedications.length > 1
          ? 's, from newest to oldest'
          : ''
      }`,
    ).trimEnd();

    const previousRxs = prescription.groupedMedications
      .map(previousRx => {
        return joinBlocks(
          `Prescription number: ${previousRx.prescriptionNumber}`,
          `Last filled: ${dateFormat(
            previousRx.sortedDispensedDate,
            'MMMM D, YYYY',
            'Date not available',
          )}`,
          fieldLine('Quantity', previousRx.quantity),
          `Prescribed on: ${dateFormat(
            previousRx.orderedDate,
            'MMMM D, YYYY',
            'Date not available',
          )}`,
          `Prescribed by: ${displayProviderName(
            prescription.providerFirstName,
            prescription.providerLastName,
          )}`,
        ).trimEnd();
      })
      .join(newLine(3));

    previousRxSection = joinBlocks(previousRxHeader, previousRxs);
  }

  return `${header}${mostRecentRxSection}${newLine(
    3,
  )}${refillHistorySection}${previousRxSection}${newLine()}`;
};
