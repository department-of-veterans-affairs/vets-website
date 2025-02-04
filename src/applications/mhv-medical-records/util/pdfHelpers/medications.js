import { medicationTypes } from '../constants';

export const generateMedicationsContent = record => {
  let content;

  if (record.type === medicationTypes.VA) {
    content = {
      details: [
        {
          header: 'About your prescription',
          items: [
            {
              title: 'Last filled on',
              value: record.lastFilledOn,
              inline: true,
            },
            {
              title: 'Status',
              value: record.status,
              inline: true,
            },
            {
              title: 'Refills left',
              value: record.refillsLeft,
              inline: true,
            },
            {
              title: 'Request refills by this prescription expiration date',
              value: record.expirationDate,
              inline: true,
            },
            {
              title: 'Prescription number',
              value: record.prescriptionNumber,
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: record.prescribedOn,
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: record.prescribedBy,
              inline: true,
            },
            {
              title: 'Facility',
              value: record.facility,
              inline: true,
            },
            {
              title: 'Pharmacy phone number',
              value: record.pharmacyPhoneNumber,
              inline: true,
            },
          ],
        },
        {
          header: 'About this medication or supply',
          items: [
            {
              title: 'Instructions',
              value: record.instructions,
              inline: true,
            },
            {
              title: 'Reason for use',
              value: record.indicationForUse,
              inline: true,
            },
            {
              title: 'Quantity',
              value: record.quantity,
              inline: true,
            },
          ],
        },
      ],
    };

    if (record.status === 'Active') {
      content.details[0].items.splice(
        2,
        0,
        {
          value:
            'This is a current prescription. If you have refills left, you can request a refill now.',
        },
        {
          title: 'Note',
          value:
            "If you have no refills left, you'll need to request a renewal instead.",
          inline: true,
        },
      );
    }
  } else {
    content = {
      details: [
        {
          header: 'About this medication or supply',
          items: [
            {
              title: 'Instructions',
              value: record.instructions,
              inline: true,
            },
            {
              title: 'Reason for use',
              value: record.reasonForUse,
              inline: true,
            },
            {
              title: 'Status',
              value: record.status,
              inline: true,
            },
            {
              value:
                "A VA provider added this medication record in your VA medical records. But this isn't a prescription you filled through a VA pharmacy. You can't request refills or manage this medication through this online tool.",
            },
            {
              title: 'Non-VA medications include these types:',
              isRich: true,
              lineGap: 1,
              value: [
                {
                  value: [
                    'Prescriptions you filled through a non-VA pharmacy',
                    'Over-the-counter medications, supplements, and herbal remedies',
                    'Sample medications a provider gave you',
                    "Other drugs you're taking that you don't have a prescription for, including recreational drugs",
                  ],
                },
              ],
            },
            {
              title: 'When you started taking this medication',
              value: record.startDate,
              inline: true,
            },
            {
              title: 'Documented by',
              value: record.documentedBy,
              inline: true,
            },
            {
              title: 'Documented at this facility',
              value: record.documentedAtFacility,
              inline: true,
            },
            {
              title: 'Provider notes',
              value: record.providerNotes,
              inline: true,
            },
          ],
        },
      ],
    };
  }

  // need an example of an active, non-VA medication

  return content;
};
