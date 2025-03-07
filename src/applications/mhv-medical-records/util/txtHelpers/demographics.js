import { generateDemographicsContent } from '../pdfHelpers/demographics';

// Helper function to format the demographics content into plain text
const formatDemographicsContentToText = content => {
  // Extract the `items` array from the nested structure
  const sections = content.results.items;

  // Format each section into plain text
  return sections
    .map(section => {
      // Extract the header (if any) and items in the section
      const header = section.header ? `${section.header}:\n` : '';
      const itemsText = section.items
        .map(
          item =>
            `${item.title || 'Unknown'}: ${item.value ||
              'No information provided'}`,
        )
        .join('\n'); // Join item strings with newlines

      return `${header}${itemsText}`;
    })
    .join('\n\n'); // Separate sections with double newlines
};

// Function to parse demographics
export const parseDemographics = (records, index = 9) => {
  return `
${index}) Demographics

Each of your VA facilities may have different demographic information for you. 
If you need to update your information, contact your facility.

${records
    .map(record => {
      // Generate content and format it as text
      let demographicsContent;
      try {
        demographicsContent = generateDemographicsContent(record);

        // Format content into plain text
        demographicsContent = formatDemographicsContentToText(
          demographicsContent,
        );
      } catch (error) {
        demographicsContent = 'Error formatting demographics content';
      }

      return `
VA Facility: ${record.facility || 'Unknown Facility'}
${demographicsContent}
      `;
    })
    .join('\n\n')}
`;
};
