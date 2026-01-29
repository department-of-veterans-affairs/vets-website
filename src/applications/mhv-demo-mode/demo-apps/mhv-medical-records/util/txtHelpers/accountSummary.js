import { generateAccountSummaryContent } from '../pdfHelpers/accountSummary';

// Function to parse account summaries
export const parseAccountSummary = (records, index = 11) => {
  // Generate the structured content
  const accountSummaryContent = generateAccountSummaryContent(records || {});

  // Initialize an array to hold the formatted text
  const formattedText = [];

  // Process 'details' section if it exists
  if (
    accountSummaryContent.details &&
    Array.isArray(accountSummaryContent.details.items)
  ) {
    accountSummaryContent.details.items.forEach(item => {
      const title = item.title || 'Unknown';
      const value = item.value || 'No information provided';
      formattedText.push(`${title}: ${value}`);
    });
  }

  // Process 'results' section if it exists
  if (
    accountSummaryContent.results &&
    Array.isArray(accountSummaryContent.results.items)
  ) {
    formattedText.push('\nVA Treatment Facilities:');
    accountSummaryContent.results.items.forEach(facility => {
      const header = facility.header || 'Unknown Facility';
      formattedText.push(`\n${header}:`);
      if (Array.isArray(facility.items)) {
        facility.items.forEach(item => {
          const title = item.title || 'Unknown';
          const value = item.value || 'No information provided';
          formattedText.push(`  ${title}: ${value}`);
        });
      }
    });
  }

  // Join the formatted text array into a single string
  return `
${index}) Account Summary

My HealtheVet account summary

${formattedText.join('\n')}
`;
};
