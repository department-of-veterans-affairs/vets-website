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
} from './constants';

/**
 * Return Non-VA prescription PDF list
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
              value: dateFormat(rx.dispensedDate, 'MMMM D, YYYY'),
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
              title: 'Prescription number',
              value: rx.prescriptionNumber,
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: dateFormat(rx.orderedDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value:
                (rx.providerFirstName && rx.providerLastName) || 'None noted',
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
          ],
        },
        {
          header: 'About this medication or supply',
          items: [
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
          ],
        },
      ],
    };
  });
};

/**
 * Return allergies PDF list
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
 */
export const buildVAPrescriptionPDFList = prescription => {
  const refillHistory = [...(prescription?.rxRfRecords || [])];
  const originalFill = createOriginalFillRecord(prescription);
  refillHistory.push(originalFill);

  return [
    {
      header: 'About your prescription',
      sectionSeparators: false,
      sections: [
        {
          items: [
            {
              title: 'Last filled on',
              value: dateFormat(
                (prescription.rxRfRecords?.length &&
                  prescription.rxRfRecords[0].dispensedDate) ||
                  prescription.dispensedDate,
                'MMMM D, YYYY',
              ),
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
              title: 'Prescription number',
              value: prescription.prescriptionNumber,
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
          ],
        },
      ],
    },
    {
      header: 'About this medication or supply',
      sectionSeparators: false,
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
              title: 'Quantity',
              value: validateField(prescription.quantity),
              inline: true,
            },
          ],
        },
      ],
    },
    {
      header: 'Refill history',
      sectionSeparators: true,
      sectionSeperatorOptions: {
        spaceFromEdge: 16,
        linesAbove: 0,
        linesBelow: 1,
      },
      sections: [
        {
          items: refillHistory
            .map((entry, i) => {
              const { shape, color, backImprint, frontImprint } = entry;
              const index = refillHistory.length - i - 1;
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
              return [
                {
                  value: [
                    {
                      value: `${
                        index === 0 ? 'First fill' : `Refill ${index}`
                      }`,
                      weight: 'bold',
                      itemSeperator: index !== refillHistory.length - 1,
                      itemSeperatorOptions: {
                        spaceFromEdge: 16,
                        linesAbove: 0.5,
                        linesBelow: 0.7,
                      },
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
                  value: entry?.trackingList?.[0]?.completeDateTime
                    ? dateFormat(entry.trackingList[0].completeDateTime)
                    : 'None noted',
                  inline: true,
                },
              ];
            })
            .flat(),
        },
      ],
    },
  ];
};
