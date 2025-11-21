import { generateMedicationsContent } from '../pdfHelpers/medications';
import { isArrayAndHasItems } from '../helpers';

export const parseMedications = (records, index = 7) => {
  return `
${index}) Medications

This is a list of prescriptions and other medications in your VA medical records.
When you share your medications list with providers, make sure you also tell them 
about your allergies and reactions to medications. When you download medications records, 
we also include a list of allergies and reactions in your VA medical records.

Showing ${records.length} medications, alphabetically by name:

${records
    .map(record => {
      const title = record.prescriptionName;
      const content = generateMedicationsContent(record);

      // Check if content.details exists and is an array
      const formattedDetails = content.details?.length
        ? content.details
            .map(detail => {
              const header = `\n${detail.header}:\n`;
              const items = (isArrayAndHasItems(detail.items)
                ? detail.items
                : []
              )
                .map(item => {
                  if (item.title && item.value) {
                    return `- ${item.title}: ${item.value}`;
                  }
                  if (item.value) {
                    return `- ${item.value}`;
                  }
                  return '';
                })
                .join('\n');
              return `${header}${items}`;
            })
            .join('\n\n')
        : 'No details available for this record.';

      // Combine title and formatted details
      return `Title: ${title}\n${formattedDetails}`;
    })
    .join('\n\n')}
`;
};
