/**
 * Prescription Builders for PDF and TXT exports
 *
 * High-level builders that create complete prescription data structures
 * for PDF and TXT export formats.
 */
import {
  formatDate,
  formatProviderName,
  formatList,
  validateField,
  validateFieldWithName,
  DATETIME_FORMATS,
  FIELD_NOT_AVAILABLE,
} from './formatters';
import { ACTIVE_NON_VA, NON_VA_MEDICATION_DESCRIPTION } from './staticContent';

// Import helpers that are specific to prescription processing
import {
  createNoDescriptionText,
  createVAPharmacyText,
  determineRefillLabel,
  getMostRecentRxRefill,
  getRefillHistory,
  getShowRefillHistory,
  prescriptionMedAndRenewalStatus,
} from '../helpers';
import {
  getPdfStatusDefinitionKey,
  getStatusDefinitions,
} from '../helpers/getRxStatus';
import {
  medStatusDisplayTypes,
  RX_SOURCE,
  DISPENSE_STATUS,
} from '../constants';

// ============================================================================
// TXT Helper Functions
// ============================================================================

const newLine = (n = 1) => '\n'.repeat(n);
const joinLines = (...lines) => lines.filter(Boolean).join(newLine(2));
const joinBlocks = (...blocks) =>
  blocks
    .filter(Boolean)
    .map(b => b.trimEnd())
    .join(newLine(2)) + newLine();
const fieldLine = (label, value) =>
  `${label}: ${validateFieldWithName(label, value)}`;
const SEPARATOR =
  '---------------------------------------------------------------------------------';

const getLastFilledAndRxNumberBlock = rx => {
  const pendingMed =
    rx?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    rx?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
  const pendingRenewal =
    rx?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    rx?.dispStatus === DISPENSE_STATUS.RENEW;
  const isRxPending = pendingMed || pendingRenewal;

  return isRxPending
    ? ''
    : joinLines(
        `Last filled on: ${formatDate(
          rx.sortedDispensedDate,
          DATETIME_FORMATS.longMonthDate,
          'Date not available',
        )}`,
        `Prescription number: ${rx.prescriptionNumber || 'Not available'}`,
      );
};

const getAttributes = (rx, isCernerPilot, isV2StatusMapping = false) =>
  joinLines(
    `Status: ${prescriptionMedAndRenewalStatus(
      rx,
      medStatusDisplayTypes.TXT,
      isCernerPilot,
      isV2StatusMapping,
    )}`,
    fieldLine('Refills left', rx.refillRemaining),
    `Request refills by this prescription expiration date: ${formatDate(
      rx.expirationDate,
      DATETIME_FORMATS.longMonthDate,
      'Date not available',
    )}`,
    fieldLine('Facility', rx.facilityName),
    isCernerPilot
      ? fieldLine(
          'Pharmacy contact information',
          'Check your prescription label or contact your VA facility.',
        )
      : fieldLine('Pharmacy phone number', rx.phoneNumber),
    fieldLine('Instructions', rx.sig),
    !isCernerPilot && fieldLine('Reason for use', rx.indicationForUse),
    `Prescribed on: ${formatDate(
      rx.orderedDate,
      DATETIME_FORMATS.longMonthDate,
      'Date not available',
    )}`,
    `Prescribed by: ${formatProviderName(
      rx.providerFirstName,
      rx.providerLastName,
    )}`,
  );

// ============================================================================
// PDF Builders - Non-VA Prescription
// ============================================================================

/**
 * Return Non-VA prescription PDF list
 * @param {Object} prescription - Non-VA prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @returns {Array} PDF config items
 */
export const buildNonVAPrescriptionPDFList = (
  prescription,
  isCernerPilot = false,
) => {
  return [
    {
      sections: [
        {
          items: [
            {
              title: 'Instructions',
              value: prescription.sig || 'Instructions not available',
              inline: true,
            },
            !isCernerPilot && {
              title: 'Reason for use',
              value:
                prescription.indicationForUse || 'Reason for use not available',
              inline: true,
            },
            {
              title: 'Status',
              value: ACTIVE_NON_VA,
              inline: true,
            },
            {
              value: NON_VA_MEDICATION_DESCRIPTION,
            },
            {
              title: 'When you started taking this medication',
              value: formatDate(
                prescription.dispensedDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Documented by',
              value: formatProviderName(
                prescription.providerFirstName,
                prescription.providerLastName,
              ),
              inline: true,
            },
            {
              title: 'Documented at this facility',
              value:
                prescription.facilityName || 'VA facility name not available',
              inline: true,
            },
          ],
        },
      ],
    },
  ];
};

// ============================================================================
// PDF Builders - Prescriptions List
// ============================================================================

/**
 * Return prescriptions PDF list
 * @param {Array} prescriptions - Array of prescriptions
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Array} PDF config items
 */
export const buildPrescriptionsPDFList = (
  prescriptions,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const statusDefinitions = getStatusDefinitions(
    isCernerPilot,
    isV2StatusMapping,
  );

  return prescriptions?.map(rx => {
    if (rx?.prescriptionSource === RX_SOURCE.NON_VA) {
      return {
        ...buildNonVAPrescriptionPDFList(rx, isCernerPilot)[0],
        header: rx?.prescriptionName || rx?.orderableItem,
      };
    }

    const pendingMed =
      rx?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
      rx?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
    const pendingRenewal =
      rx?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
      rx?.dispStatus === DISPENSE_STATUS.RENEW;
    const isPending = pendingMed || pendingRenewal;

    const statusDefinitionKey = getPdfStatusDefinitionKey(
      rx.dispStatus,
      rx.refillStatus,
    );

    const mostRecentRxRefillLine = () => {
      const newest = getMostRecentRxRefill(rx);

      if (!newest) return '';

      const filledDate = formatDate(
        newest.sortedDispensedDate,
        DATETIME_FORMATS.longMonthDate,
        'Date not available',
      );

      return `${newest.prescriptionNumber}, last filled on ${filledDate}`;
    };

    return {
      header: rx.prescriptionName,
      sections: [
        {
          items: [
            ...(!isPending
              ? [
                  {
                    title: 'Last filled on',
                    value: formatDate(
                      rx.sortedDispensedDate,
                      DATETIME_FORMATS.longMonthDate,
                      'Date not available',
                    ),
                    inline: true,
                  },
                  {
                    title: 'Prescription number',
                    value: rx.prescriptionNumber || 'Not available',
                    inline: true,
                  },
                ]
              : []),
            {
              title: 'Status',
              value: validateField(
                prescriptionMedAndRenewalStatus(
                  rx,
                  medStatusDisplayTypes.PRINT,
                  isCernerPilot,
                  isV2StatusMapping,
                ),
              ),
              inline: true,
            },
            {
              isRich: true,
              value:
                !pendingMed &&
                !pendingRenewal &&
                statusDefinitions?.[statusDefinitionKey]?.length > 1
                  ? statusDefinitions[statusDefinitionKey].slice(1)
                  : [],
            },
            {
              title: 'Refills left',
              value: validateFieldWithName(
                'Number of refills left',
                rx.refillRemaining,
              ),
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: formatDate(
                rx.expirationDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateFieldWithName('Facility', rx.facilityName),
              inline: true,
            },
            (isCernerPilot && {
              title: 'Pharmacy contact information',
              value:
                'Check your prescription label or contact your VA facility.',
              inline: true,
            }) || {
              title: 'Pharmacy phone number',
              value: validateFieldWithName(
                'Pharmacy phone number',
                rx.phoneNumber,
              ),
              inline: true,
            },
            {
              title: 'Instructions',
              value: validateFieldWithName('Instructions', rx.sig),
              inline: true,
            },
            !isCernerPilot && {
              title: 'Reason for use',
              value: validateFieldWithName(
                'Reason for use',
                rx.indicationForUse,
              ),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: formatDate(
                rx.orderedDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: formatProviderName(
                rx.providerFirstName,
                rx.providerLastName,
              ),
              inline: true,
            },
            rx.groupedMedications?.length > 0 && {
              title: 'Most recent prescription associated with this medication',
              value: mostRecentRxRefillLine(),
              inline: true,
            },
          ],
        },
      ],
    };
  });
};

// ============================================================================
// PDF Builders - Medication Information
// ============================================================================

/**
 * Return medication information PDF
 * @param {Array} list - List of medication information items
 * @returns {Object} PDF config
 */
export const buildMedicationInformationPDF = list => {
  const listOfHeaders = ['h2', 'h3'];
  const sections = [
    ...list
      .filter(listItem => listOfHeaders.includes(listItem.type))
      .map(listItem => {
        const object = { header: '', headerSize: 'H2', items: [] };
        object.header = listItem.text;
        const index = list.indexOf(listItem);
        const nextHeader = list
          .slice(index + 1)
          .find(i => listOfHeaders.includes(i.type));
        const nextIndex = nextHeader ? list.indexOf(nextHeader) : list.length;
        const subList = list.slice(index + 1, nextIndex);
        const isEndOfList = i => subList[i + 1]?.type !== 'li';
        let liArray = [];
        object.items = subList.flatMap((subItem, i) => {
          if (subItem.type === 'li') {
            liArray.push(subItem.text);
            if (isEndOfList(i)) {
              return {
                value: [
                  {
                    value: liArray,
                  },
                ],
                isRich: true,
                disablePageSplit: true,
              };
            }
            return [];
          }
          liArray = [];
          return [
            {
              value: subItem.text,
              disablePageSplit: true,
            },
          ];
        });
        return object;
      }),
  ];
  return {
    sections,
  };
};

// ============================================================================
// PDF Builders - Allergies
// ============================================================================

/**
 * Return allergies PDF list
 * @param {Array} allergies - Array of allergies
 * @returns {Array} PDF config items
 */
export const buildAllergiesPDFList = allergies => {
  return allergies.map(item => {
    return {
      header: item.name,
      sections: [
        {
          items: [
            {
              title: 'Signs and symptoms',
              value: formatList(item.reaction, FIELD_NOT_AVAILABLE),
              inline: true,
            },
            {
              title: 'Type of allergy',
              value: item.type,
              inline: true,
            },
            {
              title: 'Observed or historical',
              value: item.observedOrReported,
              inline: true,
            },
          ],
        },
      ],
    };
  });
};

// ============================================================================
// PDF Builders - VA Prescription Details
// ============================================================================

/**
 * Return VA prescription PDF list
 * @param {Object} prescription - VA prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Array} PDF config items
 */
export const buildVAPrescriptionPDFList = (
  prescription,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const refillHistory = getRefillHistory(prescription);
  const showRefillHistory = getShowRefillHistory(refillHistory);
  const pendingMed =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
  const pendingRenewal =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === DISPENSE_STATUS.RENEW;

  const statusDefinitions = getStatusDefinitions(
    isCernerPilot,
    isV2StatusMapping,
  );
  const statusDefinitionKey = getPdfStatusDefinitionKey(
    prescription.dispStatus,
    prescription.refillStatus,
  );

  const VAPrescriptionPDFList = [
    {
      header: 'Most recent prescription',
      sections: [
        {
          items: [
            pendingMed || pendingRenewal
              ? ''
              : {
                  title: 'Last filled on',
                  value: formatDate(
                    prescription.sortedDispensedDate,
                    DATETIME_FORMATS.longMonthDate,
                    'Date not available',
                  ),
                  inline: true,
                },
            ...(!pendingMed && !pendingRenewal
              ? [
                  {
                    title: 'Prescription number',
                    value: prescription.prescriptionNumber || 'Not available',
                    inline: true,
                  },
                ]
              : []),
            {
              title: 'Status',
              value: validateField(
                prescriptionMedAndRenewalStatus(
                  prescription,
                  medStatusDisplayTypes.PRINT,
                  isCernerPilot,
                  isV2StatusMapping,
                ),
              ),
              inline: true,
            },
            {
              isRich: true,
              value:
                !pendingMed &&
                !pendingRenewal &&
                statusDefinitions?.[statusDefinitionKey]?.length > 1
                  ? statusDefinitions[statusDefinitionKey].slice(1)
                  : [],
            },
            {
              title: 'Refills left',
              value: validateFieldWithName(
                'Number of refills left',
                prescription.refillRemaining,
              ),
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: formatDate(
                prescription.expirationDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateFieldWithName(
                'Facility',
                prescription.facilityName,
              ),
              inline: true,
            },
            (isCernerPilot && {
              title: 'Pharmacy contact information',
              value:
                'Check your prescription label or contact your VA facility.',
              inline: true,
            }) || {
              title: 'Pharmacy phone number',
              value: validateFieldWithName(
                'Pharmacy phone number',
                prescription.phoneNumber,
              ),
              inline: true,
            },
            {
              title: 'Instructions',
              value: validateFieldWithName('Instructions', prescription.sig),
              inline: true,
            },
            !isCernerPilot && {
              title: 'Reason for use',
              value: validateFieldWithName(
                'Reason for use',
                prescription.indicationForUse,
              ),
              inline: true,
            },
            {
              title: 'Quantity',
              value: validateFieldWithName('Quantity', prescription.quantity),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: formatDate(
                prescription.orderedDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: formatProviderName(
                prescription.providerFirstName,
                prescription.providerLastName,
              ),
              inline: true,
            },
          ],
        },
      ],
    },
    ...(showRefillHistory && !isCernerPilot
      ? [
          {
            header: 'Refill history',
            indent: 32,
            headerSize: 'H4',
            sections: [
              {
                items: [
                  {
                    value: `Showing ${refillHistory.length} fill${
                      refillHistory.length > 1 ? 's, from newest to oldest' : ''
                    }`,
                    indent: 32,
                  },
                ],
              },
              ...refillHistory
                .map((entry, i) => {
                  const { shape, color, backImprint, frontImprint } = entry;
                  const isPartialFill =
                    entry.prescriptionSource === RX_SOURCE.PARTIAL_FILL;
                  const refillLabel = determineRefillLabel(
                    isPartialFill,
                    refillHistory,
                    i,
                  );
                  const phone =
                    entry.cmopDivisionPhone || entry.dialCmopDivisionPhone;
                  const hasValidDesc =
                    shape?.trim() && color?.trim() && frontImprint?.trim();
                  const description = hasValidDesc
                    ? `* Shape: ${shape[0].toUpperCase()}${shape
                        .slice(1)
                        .toLowerCase()}
* Color: ${color[0].toUpperCase()}${color.slice(1).toLowerCase()}
* Front marking: ${frontImprint}
${backImprint ? `* Back marking: ${backImprint}` : ''}`
                    : createNoDescriptionText(phone);
                  return {
                    header: `${refillLabel}: ${formatDate(
                      entry.dispensedDate,
                      DATETIME_FORMATS.longMonthDate,
                      'Date not available',
                    )}`,
                    indent: 32,
                    headerSize: 'H5',
                    items: [
                      ...(isPartialFill
                        ? [
                            {
                              value:
                                'This fill has a smaller quantity on purpose.',
                              indent: 32,
                            },
                            {
                              title: 'Quantity',
                              inline: true,
                              value: validateFieldWithName(
                                'Quantity',
                                entry.quantity,
                              ),
                              indent: 32,
                            },
                          ]
                        : []),
                      ...(i === 0 && !isPartialFill
                        ? [
                            {
                              title: `Shipped on`,
                              value: formatDate(
                                prescription?.trackingList?.[0]
                                  ?.completeDateTime,
                                DATETIME_FORMATS.longMonthDate,
                                'Date not available',
                              ),
                              inline: true,
                              indent: 32,
                            },
                          ]
                        : []),
                      ...(!isPartialFill && !isCernerPilot
                        ? [
                            {
                              title: 'Medication description',
                              inline: false,
                              indent: 32,
                            },
                          ]
                        : []),
                      ...(hasValidDesc && !isPartialFill && !isCernerPilot
                        ? [
                            {
                              title: 'Note',
                              value: `If the medication you’re taking doesn’t match this description, call ${createVAPharmacyText(
                                phone,
                              )}.`,
                              inline: true,
                              indent: 32,
                            },
                          ]
                        : []),
                      ...(!isPartialFill && !isCernerPilot
                        ? [
                            {
                              value: description,
                              indent: 32,
                            },
                          ]
                        : []),
                    ],
                  };
                })
                .flat(),
            ],
          },
        ]
      : []),
  ];

  if (prescription?.groupedMedications?.length > 0) {
    VAPrescriptionPDFList.push({
      header: 'Previous prescriptions',
      headerSize: 'H3',
      sections: [
        {
          items: [
            {
              value: `Showing ${
                prescription.groupedMedications.length
              } prescription${
                prescription.groupedMedications.length > 1
                  ? 's, from newest to oldest'
                  : ''
              }`,
              indent: 32,
            },
          ],
        },
        ...prescription.groupedMedications.map(previousPrescription => {
          return {
            header: `Prescription number: ${previousPrescription.prescriptionNumber ||
              'Not available'}`,
            indent: 32,
            items: [
              {
                title: 'Last filled',
                value: formatDate(
                  previousPrescription.sortedDispensedDate,
                  DATETIME_FORMATS.longMonthDate,
                  'Date not available',
                ),
                inline: true,
                indent: 32,
              },
              {
                title: 'Quantity',
                value: validateFieldWithName(
                  'Quantity',
                  previousPrescription.quantity,
                ),
                inline: true,
                indent: 32,
              },
              {
                title: 'Prescribed on',
                value: formatDate(
                  previousPrescription.orderedDate,
                  DATETIME_FORMATS.longMonthDate,
                  'Date not available',
                ),
                inline: true,
                indent: 32,
              },
              {
                title: 'Prescribed by',
                value: formatProviderName(
                  previousPrescription.providerFirstName,
                  previousPrescription.providerLastName,
                ),
                inline: true,
                indent: 32,
              },
            ],
          };
        }),
      ],
    });
  }

  return VAPrescriptionPDFList;
};

// ============================================================================
// TXT Builders - Non-VA Prescription
// ============================================================================

/**
 * Return Non-VA prescription TXT
 * @param {Object} prescription - Non-VA prescription object
 * @param {Object} options - Options for building
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @returns {string} TXT content
 */
export const buildNonVAPrescriptionTXT = (
  prescription,
  options = {},
  isCernerPilot = false,
) => {
  const { includeSeparators = true } = options ?? {};
  const header = includeSeparators
    ? `${newLine()}${SEPARATOR}${newLine(3)}`
    : '';

  const body = joinBlocks(
    prescription?.prescriptionName || prescription?.orderableItem,
    joinLines(
      fieldLine('Instructions', prescription.sig),
      !isCernerPilot &&
        fieldLine('Reason for use', prescription.indicationForUse),
      `Status: ${validateField(
        prescription.dispStatus?.toString(),
      )}${newLine()}${NON_VA_MEDICATION_DESCRIPTION}`,
    ),
    joinLines(
      `When you started taking this medication: ${formatDate(
        prescription.dispensedDate,
        DATETIME_FORMATS.longMonthDate,
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

// ============================================================================
// TXT Builders - Prescriptions List
// ============================================================================

/**
 * Return prescriptions list TXT
 * @param {Array} prescriptions - Array of prescriptions
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {string} TXT content
 */
export const buildPrescriptionsTXT = (
  prescriptions,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const mostRecentRxRefillLine = rx => {
    const newest = getMostRecentRxRefill(rx);

    if (!newest) return '';

    const filledDate = formatDate(
      newest.sortedDispensedDate,
      DATETIME_FORMATS.longMonthDate,
      'Date not available',
    );

    return `Most recent prescription associated with this medication: ${
      newest.prescriptionNumber
    }, last filled on ${filledDate}`;
  };
  const header = `${newLine()}${SEPARATOR}${newLine(3)}`;

  const body = (prescriptions || []).map(rx => {
    if (rx?.prescriptionSource === RX_SOURCE.NON_VA) {
      return buildNonVAPrescriptionTXT(
        rx,
        {
          includeSeparators: false,
        },
        isCernerPilot,
      ).trimEnd();
    }

    const title = rx.prescriptionName;
    const mostRecent = mostRecentRxRefillLine(rx);

    return joinBlocks(
      title,
      getLastFilledAndRxNumberBlock(rx),
      getAttributes(rx, isCernerPilot, isV2StatusMapping),
      mostRecent,
    ).trimEnd();
  });

  return `${header}${body.join(newLine(3))}${newLine(2)}`;
};

// ============================================================================
// TXT Builders - Allergies
// ============================================================================

/**
 * Return allergies TXT
 * @param {Array|null} allergies - Array of allergies or null if error
 * @returns {string} TXT content
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
          `Signs and symptoms: ${formatList(
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

// ============================================================================
// TXT Builders - VA Prescription Details
// ============================================================================

/**
 * Return VA prescription TXT
 * @param {Object} prescription - VA prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {string} TXT content
 */
export const buildVAPrescriptionTXT = (
  prescription,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const header = `${newLine()}${SEPARATOR}${newLine(3)}`;
  const rxTitle = prescription?.prescriptionName || prescription?.orderableItem;
  const subTitle = `Most recent prescription`;

  const mostRecentRxSection = joinLines(
    `${rxTitle}${newLine()}`,
    `${subTitle}${newLine()}`,
    getLastFilledAndRxNumberBlock(prescription),
    getAttributes(prescription, isCernerPilot, isV2StatusMapping),
  ).trimEnd();

  let refillHistorySection = '';
  const refillHistory = getRefillHistory(prescription);
  const showRefillHistory = getShowRefillHistory(refillHistory);
  if (showRefillHistory && !isCernerPilot) {
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
        const isPartialFill =
          record.prescriptionSource === RX_SOURCE.PARTIAL_FILL;
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
          `${refillLabel}: ${formatDate(
            record.dispensedDate,
            DATETIME_FORMATS.longMonthDate,
            'Date not available',
          )}`,
          isPartialFill
            ? joinLines(
                'This fill has a smaller quantity on purpose.',
                `Quantity: ${record.quantity}`,
              )
            : '',
          i === 0 && !isPartialFill
            ? `Shipped on: ${formatDate(
                prescription?.trackingList?.[0]?.completeDateTime,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              )}`
            : '',
          !isPartialFill && !isCernerPilot
            ? `Medication description: ${description}`
            : '',
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
          `Prescription number: ${previousRx.prescriptionNumber ||
            'Not available'}`,
          `Last filled: ${formatDate(
            previousRx.sortedDispensedDate,
            DATETIME_FORMATS.longMonthDate,
            'Date not available',
          )}`,
          fieldLine('Quantity', previousRx.quantity),
          `Prescribed on: ${formatDate(
            previousRx.orderedDate,
            DATETIME_FORMATS.longMonthDate,
            'Date not available',
          )}`,
          `Prescribed by: ${formatProviderName(
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
