import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';

export const parseLabsAndTests = (records, index = 1) => {
  return `
${index}) Lab and test results

If your results are outside the reference range, this doesn't automatically mean you have a health problem. Your provider will explain what your results mean for your health.

${
  Array.isArray(records)
    ? records
        .map(record => {
          const details = [];

          if (record.name !== 'Electrocardiogram (EKG)') {
            details.push('Details about this test:', ' ');

            if (record.sampleTested)
              details.push(`Site or sample tested: ${record.sampleTested}`);
            if (record.reason)
              details.push(`Reason for test: ${record.reason}`);
            if (record.clinicalHistory)
              details.push(`Clinical history: ${record.clinicalHistory}`);
            if (record.imagingLocation)
              details.push(`Imaging location: ${record.imagingLocation}`);
            if (record.imagingProvider)
              details.push(`Imaging provider: ${record.imagingProvider}`);
            if (record.sampleFrom)
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
                  ...record.results.map(result =>
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
          } else {
            details.push(
              record.date ? `Date: ${record.date}` : '',
              record.orderedBy ? `Provider: ${record.orderedBy}` : '',
            );
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
