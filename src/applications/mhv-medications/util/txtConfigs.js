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
} from './helpers';
import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  FIELD_NOT_AVAILABLE,
} from './constants';

const nl = (n = 1) => '\n'.repeat(n);
const joinLines = (...lines) => lines.filter(Boolean).join(nl(2));
const joinBlocks = (...blocks) =>
  blocks
    .filter(Boolean)
    .map(b => b.trimEnd())
    .join(nl(2)) + nl();
const fieldLine = (label, value) =>
  `${label}: ${validateIfAvailable(label, value)}`;
const SEPARATOR =
  '---------------------------------------------------------------------------------';

/**
 * Return Non-VA prescription TXT
 */
export const buildNonVAPrescriptionTXT = (prescription, options) => {
  const { includeSeparators = true } = options ?? {};
  const header = includeSeparators ? `${SEPARATOR}${nl(2)}` : '';
  const footer = includeSeparators ? `${nl(2)}${SEPARATOR}${nl(2)}` : nl(2);

  const body = joinBlocks(
    prescription?.prescriptionName || prescription?.orderableItem,
    joinLines(
      fieldLine('Instructions', prescription.sig),
      fieldLine('Reason for use', prescription.indicationForUse),
      `Status: ${validateField(
        prescription.dispStatus?.toString(),
      )}${nl()}A VA provider added this medication record in your VA medical records. But this isn’t a prescription you filled through a VA pharmacy. This could be sample medications, over-the-counter medications, supplements or herbal remedies. You can’t request refills or manage this medication through this online tool. If you aren't taking this medication, ask your provider to remove it at your next appointment.`,
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

  return `${header}${body}${footer}`;
};

/**
 * Return prescriptions list TXT
 */
export const buildPrescriptionsTXT = prescriptions => {
  const statusParagraph = statusKey => {
    const pdfStatusDefinition =
      pdfStatusDefinitions[statusKey] || pdfDefaultStatusDefinition;

    const lines = pdfStatusDefinition.flatMap(item => {
      if (Array.isArray(item.value)) {
        // each sub-item becomes a bullet line
        return item.value.map(value => `- ${String(value).trim()}`);
      }
      // normal single line
      return [String(item.value).trim()];
    });

    return lines.join(nl()).trimEnd();
  };

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
  const header = `${nl()}${SEPARATOR}${nl(3)}`;

  const body = (prescriptions || []).map(rx => {
    if (rx?.prescriptionSource === 'NV') {
      return buildNonVAPrescriptionTXT(rx, {
        includeSeparators: false,
      }).trimEnd();
    }

    const pendingMed =
      rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'NewOrder';
    const pendingRenewal =
      rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'Renew';
    const isPending = pendingMed || pendingRenewal;

    const title = rx.prescriptionName;

    const fillandRxBlock = !isPending
      ? joinLines(
          `Last filled on: ${dateFormat(
            rx.sortedDispensedDate,
            'MMMM D, YYYY',
            'Date not available',
          )}`,
          `Prescription number: ${rx.prescriptionNumber}`,
        )
      : '';

    const attributes = joinLines(
      `Status: ${rx.dispStatus || 'Unknown'} - ${statusParagraph(
        rx.refillStatus,
      )}`,
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

    const mostRecent = mostRecentRxRefillLine(rx);

    return joinBlocks(title, fillandRxBlock, attributes, mostRecent).trimEnd();
  });

  return `${header}${body.join(nl(3))}${nl(2)}`;
};

/**
 * Return allergies TXT
 */
export const buildAllergiesTXT = allergies => {
  if (!allergies) {
    return `${nl(2)}Allergies and reactions${nl(
      2,
    )}We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.${nl()}`;
  }

  if (allergies && allergies.length === 0) {
    return `${nl(2)}Allergies and reactions${nl(
      2,
    )}There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.${nl()}`;
  }

  const header = `${nl()}${SEPARATOR}${nl(3)}`;
  const footer = `${nl(2)}${SEPARATOR}${nl()}`;

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
        nl(),
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
    .join(nl());

  return `${header}${body}${nl()}${items}${footer}`;
};

/**
 * Return VA prescription TXT
 */
export const buildVAPrescriptionTXT = prescription => {
  const refillHistory = getRefillHistory(prescription);
  const showRefillHistory = getShowRefillHistory(refillHistory);
  const pendingMed =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'NewOrder';
  const pendingRenewal =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'Renew';
  let result = `
---------------------------------------------------------------------------------


${prescription?.prescriptionName || prescription?.orderableItem}


Most recent prescription

${
    pendingMed || pendingRenewal
      ? ''
      : `
Last filled on: ${dateFormat(
          prescription.sortedDispensedDate,
          'MMMM D, YYYY',
          'Date not available',
        )}
`
  }

${
    !pendingMed && !pendingRenewal
      ? `
Prescription number: ${prescription.prescriptionNumber}
`
      : ''
  }
Status: ${prescription.dispStatus || 'Unknown'}
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

Prescribed by: ${displayProviderName(
    prescription.providerFirstName,
    prescription.providerLastName,
  )}
  `;

  if (showRefillHistory) {
    result += `
Refill history

Showing ${refillHistory.length} fill${
      refillHistory.length > 1 ? 's, from newest to oldest' : ''
    }

`;

    refillHistory.forEach((entry, i) => {
      const phone = entry.cmopDivisionPhone || entry.dialCmopDivisionPhone;
      const { shape, color, backImprint, frontImprint } = entry;
      const hasValidDesc =
        shape?.trim() && color?.trim() && frontImprint?.trim();
      const isPartialFill = entry.prescriptionSource === 'PF';
      const refillLabel = determineRefillLabel(isPartialFill, refillHistory, i);
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
${refillLabel}: ${dateFormat(
        entry.dispensedDate,
        'MMMM D, YYYY',
        'Date not available',
      )}
${
        isPartialFill
          ? `
This fill has a smaller quantity on purpose.

Quantity: ${entry.quantity}`
          : ``
      }
${
        i === 0 && !isPartialFill
          ? `
Shipped on: ${dateFormat(
              prescription?.trackingList?.[0]?.completeDateTime,
              'MMMM D, YYYY',
              'Date not available',
            )}
`
          : ``
      }
${!isPartialFill ? `Medication description: ${description}` : ``}

  `;
    });
  }

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

Prescribed by: ${displayProviderName(
        prescription.providerFirstName,
        prescription.providerLastName,
      )}
      `;
    });
  }

  return result;
};
