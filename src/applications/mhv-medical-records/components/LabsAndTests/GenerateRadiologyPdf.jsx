import PropTypes from 'prop-types';
import { generatePdfScaffold } from '@department-of-veterans-affairs/mhv/exports';
import { getNameDateAndTime, makePdf } from '../../util/helpers';
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
  makePdf(pdfName, pdfData, 'Radiology details', runningUnitTest);
};

export default GenerateRadiologyPdf;

GenerateRadiologyPdf.protoTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
