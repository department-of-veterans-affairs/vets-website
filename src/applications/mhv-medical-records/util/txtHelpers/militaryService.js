import { generateMilitaryServiceContent } from '../pdfHelpers/militaryService';

export const parseMilitaryService = records => {
  return `
10) Military Service

${records
    .map(record => {
      const militaryServiceContent = generateMilitaryServiceContent(
        record.militaryService || {},
      );
      return `
Title: DOD Military Service Information

${militaryServiceContent}
    `;
    })
    .join('\n\n')}
`;
};
