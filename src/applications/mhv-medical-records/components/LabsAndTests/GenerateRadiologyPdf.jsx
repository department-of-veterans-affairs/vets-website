import PropTypes from 'prop-types';
import {
  generatePdfScaffold,
  getNameDateAndTime,
  makePdf,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  generateLabsIntro,
  generateRadiologyContent,
} from '../../util/pdfHelpers/labsAndTests';

const GenerateRadiologyPdf = async (record, user, runningUnitTest) => {
  const { title, subject, subtitles } = generateLabsIntro(record);
  const scaffold = generatePdfScaffold(user, title, subject);
  const pdfData = {
    ...scaffold,
    subtitles,
    ...generateRadiologyContent(record),
  };
  const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
  try {
    await makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      'Medical Records - Radiology details - PDF generation error',
      runningUnitTest,
    );
  } catch {
    // makePdf handles error logging to Datadog/Sentry
  }
};

export default GenerateRadiologyPdf;

GenerateRadiologyPdf.protoTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
