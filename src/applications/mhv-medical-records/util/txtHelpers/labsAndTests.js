import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';

export const parseLabsAndTests = records => {
  return `
${txtLine}
1) Lab and test results

If your results are outside the reference range, this doesn't automatically mean you have a health problem. Your provider will explain what your results mean for your health.

${
    Array.isArray(records)
      ? records
          .map(record => {
            let details = '';

            if (record.name !== 'Electrocardiogram (EKG)') {
              details += `
Details about this test:

${
                'sampleTested' in record
                  ? `Site or sample tested: ${record.sampleTested}`
                  : ''
              }
${'reason' in record ? `Reason for test: ${record.reason}` : ''}
${
                'clinicalHistory' in record
                  ? `Clinical history: ${record.clinicalHistory}`
                  : ''
              }
${
                'imagingLocation' in record
                  ? `Imaging location: ${record.imagingLocation}`
                  : ''
              }
${
                'imagingProvider' in record
                  ? `Imaging provider: ${record.imagingProvider}`
                  : ''
              }
${'sampleFrom' in record ? `Sample from: ${record.sampleFrom}` : ''}
${
                'orderedBy' in record && record.type !== 'pathology'
                  ? `Ordered by: ${record.orderedBy}`
                  : ''
              }
${
                'orderingLocation' in record
                  ? `Ordering location: ${record.orderingLocation}`
                  : ''
              }
${
                'collectingLocation' in record && record.type !== 'pathology'
                  ? `Location: ${record.collectingLocation}`
                  : ''
              }
${'labLocation' in record ? `Location: ${record.labLocation}` : ''}
${'date' in record ? `Date completed: ${record.date}` : ''}
${
                'comments' in record
                  ? `Provider notes: ${record.comments
                      .map(comment => `\n${comment}`)
                      .join('')}`
                  : ''
              }

Results:
`;
              if ('results' in record) {
                if (Array.isArray(record.results)) {
                  details += record.results
                    .map(
                      result =>
                        typeof result === 'object' && result !== null
                          ? `
${'name' in result ? `${result.name}` : ''}
${'result' in result ? `Result: ${result.result}` : ''}
${'standardRange' in result ? `Reference range: ${result.standardRange}` : ''}
${'status' in result ? `Status: ${result.status}` : ''}
${'labComments' in result ? `Lab comments: ${result.labComments}` : ''}`
                          : '',
                    )
                    .join('');
                } else {
                  details += `${record.results}\n`;
                }
              }
            } else {
              details += `
${'date' in record ? `Date: ${record.date}` : ''}
${'orderedBy' in record ? `Provider: ${record.orderedBy}` : ''}\n`;
            }

            return `
${record.name} on ${record.date}
${txtLineDotted}
${details}
`;
          })
          .join('')
      : ''
  }`;
};
