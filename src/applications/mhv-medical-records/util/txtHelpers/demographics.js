import { generateDemographicsContent } from '../pdfHelpers/demographics';

export const parseDemographics = records => {
  return `
9) Demographics

Each of your VA facilities may have different demographic information for you. 
If you need to update your information, contact your facility.

${records
    .map(record => {
      return `
VA Facility: ${record.facility}
${generateDemographicsContent(record)}
    `;
    })
    .join('\n\n')}
`;
};
