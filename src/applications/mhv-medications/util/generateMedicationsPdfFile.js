import {
  generateMedicationsPDF,
  generateTimestampForFilename,
} from './helpers';

export async function generateMedicationsPdfFile({ userName, pdfData }) {
  const filename = `VA-medications-list-${
    userName.first ? `${userName.first}-${userName.last}` : userName.last
  }-${generateTimestampForFilename()}`;
  await generateMedicationsPDF('medications', filename, pdfData);
}
