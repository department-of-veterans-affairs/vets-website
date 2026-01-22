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
import {
  getPdfStatusDefinitionKey,
  getStatusDefinitions,
} from './helpers/getRxStatus';
import {
  ACTIVE_NON_VA,
  DATETIME_FORMATS,
  FIELD_NOT_AVAILABLE,
  medStatusDisplayTypes,
  RX_SOURCE,
  DISPENSE_STATUS,
} from './constants';

/**
 * @typedef {object} LiItem
 * @property {string} value
 */

/**
 * @typedef {object} Item
 * @property {string | undefined} title
 * @property {string | Array<LiItem>} value
 * @property {boolean | undefined} inline // false by default
 * @property {boolean | undefined} isRich // false by default; must be set to true if value is an array
 * @property {boolean | undefined} disablePageSplit // false by default
 * @property {number | undefined} indent // 16 by default
 */

/**
 * @typedef {object} Section
 * @property {string | undefined} header
 * @property {Array<Item>} items
 * @property {string | undefined} headerSize // 'H4' by default
 * @property {number | undefined} indent // 16 by default
 */

/**
 * @typedef {Object} PdfConfigItem
 * @property {string | undefined} header
 * @property {boolean | undefined} sectionSeparators // false by default
 * @property {Object | undefined} sectionSeperatorOptions
 * @property {Array<Section>} sections
 * @property {number | undefined} indent // 16 by default
 * @property {string | undefined} headerSize // 'H3' by default
 */

/**
 * Return Non-VA prescription PDF list
 *
 * @returns {Array<PdfConfigItem>}
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
              value:
                "A VA provider added this medication record in your VA medical records. But this isn’t a prescription you filled through a VA pharmacy. This could be sample medications, over-the-counter medications, supplements or herbal remedies. You can't request refills or manage this medication through this online tool. If you aren’t taking this medication, ask your provider to remove it at your next appointment.",
            },
            {
              title: 'When you started taking this medication',
              value: dateFormat(
                prescription.dispensedDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Documented by',
              value: displayProviderName(
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

/**
 * Return prescriptions PDF list
 *
 * @returns {Array<PdfConfigItem>}
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

      const filledDate = dateFormat(
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
                    value: dateFormat(
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
              value: validateIfAvailable(
                'Number of refills left',
                rx.refillRemaining,
              ),
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: dateFormat(
                rx.expirationDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateIfAvailable('Facility', rx.facilityName),
              inline: true,
            },
            (isCernerPilot && {
              title: 'Pharmacy contact information',
              value:
                'Check your prescription label or contact your VA facility.',
              inline: true,
            }) || {
              title: 'Pharmacy phone number',
              value: validateIfAvailable(
                'Pharmacy phone number',
                rx.phoneNumber,
              ),
              inline: true,
            },
            {
              title: 'Instructions',
              value: validateIfAvailable('Instructions', rx.sig),
              inline: true,
            },
            !isCernerPilot && {
              title: 'Reason for use',
              value: validateIfAvailable('Reason for use', rx.indicationForUse),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(
                rx.orderedDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: displayProviderName(
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

/**
 * Return medication information PDF
 *
 * @returns {PdfConfigItem}
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

/**
 * Return allergies PDF list
 *
 * @returns {Array<PdfConfigItem>}
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
              value: processList(item.reaction, FIELD_NOT_AVAILABLE),
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

/**
 * Return VA prescription PDF list
 *
 * @returns {Array<PdfConfigItem>}
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
                  value: dateFormat(
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
              value: validateIfAvailable(
                'Number of refills left',
                prescription.refillRemaining,
              ),
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: dateFormat(
                prescription.expirationDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateIfAvailable('Facility', prescription.facilityName),
              inline: true,
            },
            (isCernerPilot && {
              title: 'Pharmacy contact information',
              value:
                'Check your prescription label or contact your VA facility.',
              inline: true,
            }) || {
              title: 'Pharmacy phone number',
              value: validateIfAvailable(
                'Pharmacy phone number',
                prescription.phoneNumber,
              ),
              inline: true,
            },
            {
              title: 'Instructions',
              value: validateIfAvailable('Instructions', prescription.sig),
              inline: true,
            },
            !isCernerPilot && {
              title: 'Reason for use',
              value: validateIfAvailable(
                'Reason for use',
                prescription.indicationForUse,
              ),
              inline: true,
            },
            {
              title: 'Quantity',
              value: validateIfAvailable('Quantity', prescription.quantity),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(
                prescription.orderedDate,
                DATETIME_FORMATS.longMonthDate,
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: displayProviderName(
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
                    header: `${refillLabel}: ${dateFormat(
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
                              value: validateIfAvailable(
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
                              value: dateFormat(
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
            header: `Prescription number: ${
              previousPrescription.prescriptionNumber || 'Not available'
            }`,
            indent: 32,
            items: [
              {
                title: 'Last filled',
                value: dateFormat(
                  previousPrescription.sortedDispensedDate,
                  DATETIME_FORMATS.longMonthDate,
                  'Date not available',
                ),
                inline: true,
                indent: 32,
              },
              {
                title: 'Quantity',
                value: validateIfAvailable(
                  'Quantity',
                  previousPrescription.quantity,
                ),
                inline: true,
                indent: 32,
              },
              {
                title: 'Prescribed on',
                value: dateFormat(
                  previousPrescription.orderedDate,
                  DATETIME_FORMATS.longMonthDate,
                  'Date not available',
                ),
                inline: true,
                indent: 32,
              },
              {
                title: 'Prescribed by',
                value: displayProviderName(
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
