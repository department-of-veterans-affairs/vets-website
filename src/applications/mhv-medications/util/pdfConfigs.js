import {
  createNoDescriptionText,
  createOriginalFillRecord,
  dateFormat,
  processList,
  validateField,
  createVAPharmacyText,
} from './helpers';
import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  nonVAMedicationTypes,
  EMPTY_FIELD,
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
 * @property {boolean | undefined} noIndentation // false by default
 */

/**
 * @typedef {object} Section
 * @property {string | undefined} header
 * @property {Array<Item>} items
 * @property {string | undefined} headerSize // 'H4' by default
 */

/**
 * @typedef {Object} PdfConfigItem
 * @property {string | undefined} header
 * @property {boolean | undefined} sectionSeparators // false by default
 * @property {Object | undefined} sectionSeperatorOptions
 * @property {Array<Section>} sections
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
              value: validateField(prescription.sig),
              inline: true,
            },
            {
              title: 'Reason for use',
              value: validateField(prescription.indicationForUse),
              inline: true,
            },
            {
              title: 'Status',
              value: validateField(prescription.dispStatus?.toString()),
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
              value: dateFormat(prescription.dispensedDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Documented by',
              value: prescription.providerLastName
                ? `${
                    prescription.providerLastName
                  }, ${prescription.providerFirstName || ''}`
                : 'None noted',
              inline: true,
            },
            {
              title: 'Documented at this facility',
              value: validateField(prescription.facilityName),
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
        header:
          rx.prescriptionName ||
          (rx.dispStatus === 'Active: Non-VA' ? rx.orderableItem : ''),
      };
    }

    return {
      header: rx.prescriptionName,
      sections: [
        {
          header: 'About your prescription',
          items: [
            {
              title: 'Last filled on',
              value: rx.sortedDispensedDate
                ? dateFormat(rx.sortedDispensedDate, 'MMMM D, YYYY')
                : 'Not filled yet',
              inline: true,
            },
            {
              title: 'Prescription number',
              value: rx.prescriptionNumber,
              inline: true,
            },
            {
              title: 'Status',
              value: validateField(rx.dispStatus),
              inline: true,
            },
            {
              isRich: true,
              value:
                pdfStatusDefinitions[rx.refillStatus] ||
                pdfDefaultStatusDefinition,
            },
            {
              title: 'Refills left',
              value: validateField(rx.refillRemaining),
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: dateFormat(rx.expirationDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateField(rx.facilityName),
              inline: true,
            },
            {
              title: 'Pharmacy phone number',
              value: validateField(rx.phoneNumber),
              inline: true,
            },
            {
              title: 'Instructions',
              value: validateField(rx.sig),
              inline: true,
            },
            {
              title: 'Reason for use',
              value: validateField(rx.indicationForUse),
              inline: true,
            },
            {
              title: 'Quantity',
              value: validateField(rx.quantity),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(rx.orderedDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: rx.providerLastName
                ? `${rx.providerLastName}, ${rx.providerFirstName || ''}`
                : 'None noted',
              inline: true,
            },
            rx.groupedMedications?.length > 0 && {
              title: 'Previous prescriptions associated with this medication',
              value: rx.groupedMedications
                .map(previousRx => {
                  return previousRx.prescriptionNumber;
                })
                .join(', '),
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
              noIndentation: true,
              disablePageSplit: true,
            },
          ];
        });
        return object;
      }),
  ];
  return {
    sectionSeparators: false,
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
      sectionSeparators: false,
      sections: [
        {
          items: [
            {
              title: 'Date entered',
              value: validateField(item.date),
              inline: true,
            },
            {
              title: 'Signs and symptoms',
              value: processList(item.reaction),
              inline: true,
            },
            {
              title: 'Type of allergy',
              value: validateField(item.type),
              inline: true,
            },
            {
              title: 'Location',
              value: validateField(item.location),
              inline: true,
            },
            {
              title: 'Observed or historical',
              value: validateField(item.observedOrReported),
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
  const refillHistory = [...(prescription?.rxRfRecords || [])];
  const originalFill = createOriginalFillRecord(prescription);
  refillHistory.push(originalFill);

  const VAPrescriptionPDFList = [
    {
      header: 'Most recent prescription',
      sectionSeparators: false,
      sections: [
        {
          items: [
            {
              title: 'Last filled on',
              value: prescription.sortedDispensedDate
                ? dateFormat(prescription.sortedDispensedDate, 'MMMM D, YYYY')
                : 'Not filled yet',
              inline: true,
            },
            {
              title: 'Prescription number',
              value: prescription.prescriptionNumber,
              inline: true,
            },
            {
              title: 'Status',
              value: validateField(prescription.dispStatus),
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
              value: validateField(prescription.refillRemaining),
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: dateFormat(prescription.expirationDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Facility',
              value: validateField(prescription.facilityName),
              inline: true,
            },
            {
              title: 'Pharmacy phone number',
              value: validateField(prescription.phoneNumber),
              inline: true,
            },
            {
              title: 'Instructions',
              value: validateField(prescription.sig),
              inline: true,
            },
            {
              title: 'Reason for use',
              value: validateField(prescription.indicationForUse),
              inline: true,
            },
            {
              title: 'Quantity',
              value: validateField(prescription.quantity),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(prescription.orderedDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: prescription.providerLastName
                ? `${
                    prescription.providerLastName
                  }, ${prescription.providerFirstName || ''}`
                : 'None noted',
              inline: true,
            },
          ],
        },
      ],
    },
    {
      header: 'Refill history',
      sectionSeparators: false,
      sections: refillHistory
        .map((entry, i) => {
          const { shape, color, backImprint, frontImprint } = entry;
          const index = refillHistory.length - i - 1;
          const phone = entry.cmopDivisionPhone || entry.dialCmopDivisionPhone;
          const hasValidDesc =
            shape?.trim() && color?.trim() && frontImprint?.trim();
          const description = hasValidDesc
            ? `* Shape: ${shape[0].toUpperCase()}${shape.slice(1).toLowerCase()}
* Color: ${color[0].toUpperCase()}${color.slice(1).toLowerCase()}
* Front marking: ${frontImprint}
${backImprint ? `* Back marking: ${backImprint}` : ''}`
            : createNoDescriptionText(phone);
          return {
            items: [
              {
                value: [
                  {
                    value: `${index === 0 ? 'First fill' : `Refill ${index}`}`,
                    weight: 'bold',
                    font: 'Bitter-Bold',
                    paragraphGap: 4.75,
                  },
                ],
                isRich: true,
              },
              {
                title: 'Medication description',
                inline: false,
              },
              ...(hasValidDesc
                ? [
                    {
                      title: 'Note',
                      value: `If the medication you’re taking doesn’t match this description, call ${createVAPharmacyText(
                        phone,
                      )}.`,
                      inline: true,
                    },
                  ]
                : []),
              {
                value: description,
              },
              {
                title: `Filled by pharmacy on`,
                value: entry?.dispensedDate
                  ? dateFormat(entry.dispensedDate)
                  : 'None noted',
                inline: true,
              },
              {
                title: `Shipped on`,
                value: dateFormat(
                  prescription?.trackingList?.[0]?.completeDateTime,
                ),
                inline: true,
              },
            ],
          };
        })
        .flat(),
    },
  ];

  if (prescription?.groupedMedications?.length > 0) {
    VAPrescriptionPDFList.push({
      header: 'Previous prescriptions',
      sectionSeparators: false,
      sections: prescription.groupedMedications.map(previousPrescription => {
        return {
          items: [
            {
              value: [
                {
                  value: `Prescription number: ${
                    previousPrescription.prescriptionNumber
                  }`,
                  weight: 'bold',
                  font: 'Bitter-Bold',
                  paragraphGap: 4.75,
                },
              ],
              isRich: true,
            },
            {
              title: 'Last filled',
              value: prescription.sortedDispensedDate
                ? dateFormat(prescription.sortedDispensedDate, 'MMMM D, YYYY')
                : 'Not filled yet',
              inline: true,
            },
            {
              title: 'Quantity',
              value: validateField(previousPrescription.quantity),
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(
                previousPrescription.orderedDate,
                'MMMM D, YYYY',
              ),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value:
                (previousPrescription.providerFirstName &&
                  previousPrescription.providerLastName) ||
                EMPTY_FIELD,
              inline: true,
            },
          ],
        };
      }),
    });
  }

  return VAPrescriptionPDFList;
};
