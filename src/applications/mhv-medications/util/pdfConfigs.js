import {
  createNoDescriptionText,
  createVAPharmacyText,
  dateFormat,
  determineRefillLabel,
  displayProviderName,
  getRefillHistory,
  getShowRefillHistory,
  processList,
  validateField,
  validateIfAvailable,
} from './helpers';
import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  nonVAMedicationTypes,
  FIELD_NOT_AVAILABLE,
  ACTIVE_NON_VA,
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
export const buildNonVAPrescriptionPDFList = prescription => {
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
            {
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
                'A VA provider added this medication record in your VA medical records. But this isn’t a prescription you filled through a VA pharmacy. You can’t request refills or manage this medication through this online tool.',
            },
            {
              title: 'Non-VA medications include these types:',
              value: nonVAMedicationTypes,
              inline: false,
            },
            {
              title: 'When you started taking this medication',
              value: dateFormat(
                prescription.dispensedDate,
                'MMMM D, YYYY',
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
            {
              title: 'Provider notes',
              value: validateField(
                (prescription.remarks ?? '') +
                  (prescription.disclaimer
                    ? ` ${prescription.disclaimer}`
                    : ''),
              ),
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
export const buildPrescriptionsPDFList = prescriptions => {
  return prescriptions?.map(rx => {
    if (rx?.prescriptionSource === 'NV') {
      return {
        ...buildNonVAPrescriptionPDFList(rx)[0],
        header: rx?.prescriptionName || rx?.orderableItem,
      };
    }

    const pendingMed =
      rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'NewOrder';
    const pendingRenewal =
      rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'Renew';

    return {
      header: rx.prescriptionName,
      sections: [
        {
          header: 'About your prescription',
          indent: 32,
          items: [
            {
              title: 'Last filled on',
              value: dateFormat(
                rx.sortedDispensedDate,
                'MMMM D, YYYY',
                'Date not available',
              ),
              inline: true,
              indent: 32,
            },
            ...(!pendingMed && !pendingRenewal
              ? [
                  {
                    title: 'Prescription number',
                    value: rx.prescriptionNumber,
                    inline: true,
                    indent: 32,
                  },
                ]
              : []),
            {
              title: 'Status',
              value: validateField(rx.dispStatus),
              inline: true,
              indent: 32,
            },
            {
              isRich: true,
              value:
                pdfStatusDefinitions[rx.refillStatus] ||
                pdfDefaultStatusDefinition,
              indent: 32,
            },
            {
              title: 'Refills left',
              value: validateIfAvailable(
                'Number of refills left',
                rx.refillRemaining,
              ),
              inline: true,
              indent: 32,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: dateFormat(
                rx.expirationDate,
                'MMMM D, YYYY',
                'Date not available',
              ),
              inline: true,
              indent: 32,
            },
            {
              title: 'Facility',
              value: validateIfAvailable('Facility', rx.facilityName),
              inline: true,
              indent: 32,
            },
            {
              title: 'Pharmacy phone number',
              value: validateIfAvailable(
                'Pharmacy phone number',
                rx.phoneNumber,
              ),
              inline: true,
              indent: 32,
            },
            {
              title: 'Instructions',
              value: validateIfAvailable('Instructions', rx.sig),
              inline: true,
              indent: 32,
            },
            {
              title: 'Reason for use',
              value: validateIfAvailable('Reason for use', rx.indicationForUse),
              inline: true,
              indent: 32,
            },
            {
              title: 'Quantity',
              value: validateIfAvailable('Quantity', rx.quantity),
              inline: true,
              indent: 32,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(
                rx.orderedDate,
                'MMMM D, YYYY',
                'Date not available',
              ),
              inline: true,
              indent: 32,
            },
            {
              title: 'Prescribed by',
              value: displayProviderName(
                rx.providerFirstName,
                rx.providerLastName,
              ),
              inline: true,
              indent: 32,
            },
            rx.groupedMedications?.length > 0 && {
              title: 'Previous prescriptions associated with this medication',
              value: rx.groupedMedications
                .map(previousRx => {
                  return previousRx.prescriptionNumber;
                })
                .join(', '),
              inline: true,
              indent: 32,
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
              title: 'Date entered',
              value: item.date,
              inline: true,
            },
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
              title: 'Location',
              value: item.location,
              inline: true,
            },
            {
              title: 'Observed or historical',
              value: item.observedOrReported,
              inline: true,
            },
            {
              title: 'Provider notes',
              value: validateField(item.notes),
              inline: !item.notes,
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
export const buildVAPrescriptionPDFList = prescription => {
  const refillHistory = getRefillHistory(prescription);
  const showRefillHistory = getShowRefillHistory(refillHistory);
  const pendingMed =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'NewOrder';
  const pendingRenewal =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'Renew';
  const VAPrescriptionPDFList = [
    {
      header: 'Most recent prescription',
      sections: [
        {
          items: [
            {
              title: 'Last filled on',
              value: dateFormat(
                prescription.sortedDispensedDate,
                'MMMM D, YYYY',
                'Date not available',
              ),
              inline: true,
            },
            ...(!pendingMed && !pendingRenewal
              ? [
                  {
                    title: 'Prescription number',
                    value: prescription.prescriptionNumber,
                    inline: true,
                  },
                ]
              : []),
            {
              title: 'Status',
              value: prescription.dispStatus || 'Unknown',
              inline: true,
            },
            {
              isRich: true,
              value:
                pdfStatusDefinitions[prescription.refillStatus] ||
                pdfDefaultStatusDefinition,
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
                'MMMM D, YYYY',
                'Date not available',
              ),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateIfAvailable('Facility', prescription.facilityName),
              inline: true,
            },
            {
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
            {
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
                'MMMM D, YYYY',
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
    ...(showRefillHistory
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
                  const isPartialFill = entry.prescriptionSource === 'PF';
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
                      'MMMM D, YYYY',
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
                                'MMMM D, YYYY',
                                'Date not available',
                              ),
                              inline: true,
                              indent: 32,
                            },
                          ]
                        : []),
                      ...(!isPartialFill
                        ? [
                            {
                              title: 'Medication description',
                              inline: false,
                              indent: 32,
                            },
                          ]
                        : []),
                      ...(hasValidDesc && !isPartialFill
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
                      ...(!isPartialFill
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
              previousPrescription.prescriptionNumber
            }`,
            indent: 32,
            items: [
              {
                title: 'Last filled',
                value: dateFormat(
                  previousPrescription.sortedDispensedDate,
                  'MMMM D, YYYY',
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
                  'MMMM D, YYYY',
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
