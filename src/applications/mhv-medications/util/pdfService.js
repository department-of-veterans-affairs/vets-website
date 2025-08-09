import { dateFormat, generateMedicationsPDF } from './helpers';

export async function generateMedicationsPdfFile({ userName, pdfData }) {
  const filename = `VA-medications-list-${
    userName.first ? `${userName.first}-${userName.last}` : userName.last
  }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`;
  await generateMedicationsPDF('medications', filename, pdfData);
}
