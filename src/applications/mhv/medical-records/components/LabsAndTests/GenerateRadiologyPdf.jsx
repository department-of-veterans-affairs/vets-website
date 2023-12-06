import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { makePdf } from '../../util/helpers';
import { reportGeneratedBy } from '../../../shared/util/constants';

const GenerateRadiologyPdf = async (record, runningUnitTest) => {
  const formattedDate = formatDateLong(record?.date);

  const pdfData = {
    headerBanner: [
      {
        text:
          'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis line at 988. Then select 1.',
      },
    ],
    headerLeft: 'Roberts, Jesse',
    headerRight: 'Date of birth: January 1, 1970',
    footerLeft: reportGeneratedBy,
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    title: `Lab and test results: ${record.name} on ${formattedDate}`,
    preface:
      'If you have questions about these results, send a secure message to your care team. ',
    results: {
      items: [
        {
          header: 'Details about this test',
          items: [
            {
              title: 'Reason for test',
              value: record.reason,
              inline: true,
            },
            {
              title: 'Clinical history',
              value: record.clinicalHistory,
              inline: true,
            },
            {
              title: 'Ordered by',
              value: record.orderedBy,
              inline: true,
            },
            {
              title: 'Ordering location',
              value: record.orderingLocation,
              inline: true,
            },
            {
              title: 'Imaging location',
              value: record.imagingLocation,
              inline: true,
            },
            {
              title: 'Imaging provider',
              value: record.imagingProvider,
              inline: true,
            },
          ],
        },
        {
          header: 'Results',
          items: [{ value: record.results }],
        },
      ],
    },
  };

  makePdf('radiology_report', pdfData, 'Radiology', runningUnitTest);
};

export default GenerateRadiologyPdf;

GenerateRadiologyPdf.protoTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
