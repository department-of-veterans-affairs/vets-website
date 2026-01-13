import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';

export const parseLabsAndTests = (
  records,
  index = 1,
  holdTimeMessagingUpdate = false,
) => {
  const holdTimeMessage = holdTimeMessagingUpdate
    ? `Your test results are available here as soon as they're ready. You may have access to your results before your care team reviews them.

Please give your care team some time to review your results. Test results can be complex. Your team can help you understand what the results mean for your overall health.

If you do review results on your own, remember that many factors can affect what they mean for you. If you have concerns, contact your care team.

`
    : '';

  return `
${index}) Lab and test results

${holdTimeMessage}If your results are outside the reference range, this doesn't automatically mean you have a health problem. Your provider will explain what your results mean for your health.

${
    Array.isArray(records)
      ? records
          .map(record => {
            const details = [];

            details.push('Details about this test:', ' ');

            if (record.sampleTested && record.type !== 'pathology')
              details.push(`Site or sample tested: ${record.sampleTested}`);
            if (record.sampleFrom && record.type === 'pathology')
              details.push(`Site or sample tested: ${record.sampleFrom}`);
            if (record.reason)
              details.push(`Reason for test: ${record.reason}`);
            if (record.clinicalHistory)
              details.push(`Clinical history: ${record.clinicalHistory}`);
            if (record.imagingLocation)
              details.push(`Imaging location: ${record.imagingLocation}`);
            if (record.imagingProvider)
              details.push(`Imaging provider: ${record.imagingProvider}`);
            if (record.sampleFrom && record.type !== 'pathology')
              details.push(`Sample from: ${record.sampleFrom}`);
            if (record.orderedBy && record.type !== 'pathology')
              details.push(`Ordered by: ${record.orderedBy}`);
            if (record.orderingLocation)
              details.push(`Ordering location: ${record.orderingLocation}`);
            if (record.collectingLocation && record.type !== 'pathology')
              details.push(`Location: ${record.collectingLocation}`);
            if (record.labLocation)
              details.push(`Location: ${record.labLocation}`);
            if (record.date) details.push(`Date completed: ${record.date}`);
            if (record.comments) {
              details.push(`Provider notes: ${record.comments}`);
            }

            details.push(' ', 'Results:', ' ');

            if ('results' in record) {
              if (Array.isArray(record.results)) {
                details.push(
                  ...record.results.map(
                    result =>
                      result && typeof result === 'object'
                        ? [
                            result.name || '',
                            result.result ? `Result: ${result.result}` : '',
                            result.standardRange
                              ? `Reference range: ${result.standardRange}`
                              : '',
                            result.status ? `Status: ${result.status}` : '',
                            result.labComments
                              ? `Lab comments: ${result.labComments}`
                              : '',
                          ]
                            .filter(Boolean) // Exclude empty lines
                            .join('\n')
                        : '',
                  ),
                );
              } else {
                details.push(record.results);
              }
            }

            return `
${record.name} on ${record.date}
${txtLineDotted}
${details.filter(Boolean).join('\n')}
`;
          })
          .join('')
      : ''
  }`;
};
