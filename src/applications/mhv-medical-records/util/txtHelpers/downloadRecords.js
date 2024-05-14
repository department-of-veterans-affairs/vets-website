import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';

import { loincCodes } from '../constants';

/**
 * Helper function to parse consolidated downloads data for txt files.
 *
 * @param {Object} data - The data from content downloads.
 * @returns a string parsed from the data being passed for all record downloads txt.
 */
export const getTxtContent = (data, { userFullName, dob }) => {
  const formatVitals = vitals => {
    const typeArray = [];
    vitals.map(
      record => !typeArray.includes(record.type) && typeArray.push(record.type),
    );
    return typeArray;
  };

  const vitalNameParse = name => {
    let parsedName = name;
    const excludeArray = [
      'PAIN',
      'CENTRAL_VENOUS_PRESSURE',
      'CIRCUMFERENCE_GIRTH',
    ];
    if (name === 'RESPIRATION') parsedName = 'Breathing rate';
    if (name === 'PULSE') parsedName = 'Heart rate';
    if (name === 'PULSE_OXIMETRY') parsedName = 'Blood oxygen level';
    if (excludeArray.includes(name)) parsedName = '';
    return parsedName;
  };

  //  Labs and test parse
  const parseLabsAndTests = records => {
    return `
${txtLine}
1) Lab and test results

If your results are outside the reference range, this doesn't automatically mean you have a health problem. Your provider will explain what your results mean for your health.

${records
      .map(
        record => `
${record.name} on ${record.date}
${txtLineDotted}
${
          record.name !== 'Electrocardiogram (EKG)'
            ? `${`
Details about this test

${'sampleTested' in record ? `Sample tested: ${record.sampleTested}` : ''}
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
                  ? `Collecting location: ${record.collectingLocation}`
                  : ''
              }
${'labLocation' in record ? `Lab location: ${record.labLocation}` : ''}
${'date' in record ? `Date completed: ${record.date}` : ''}
${
                'comments' in record
                  ? `Provider notes ${record.comments
                      .map(comment => `\n${comment}`)
                      .join('')}`
                  : ''
              }

Results
${
                'results' in record
                  ? `${
                      Array.isArray(record.results)
                        ? `${record.results
                            .map(
                              result =>
                                `\n\n${'name' in result ? `${result.name}` : ''}
  ${'result' in result ? `Result: ${result.result}` : ''}                      
  ${'standardRange' in result ? `Standard range: ${result.standardRange}` : ''}
  ${'status' in result ? `Staus: ${result.status}` : ''}
  ${
    'interpretation' in result ? `Interpretation: ${result.interpretation}` : ''
  }`,
                            )
                            .join('')}\n`
                        : `${record.results}\n`
                    }`
                  : ''
              }`}\n`
            : `
${'date' in record ? `Date: ${record.date}` : ''}
${'facility' in record ? `Location: ${record.facility}` : ''}
${'orderedBy' in record ? `Provider: ${record.orderedBy}` : ''}\n`
        }
`,
      )
      .join('')}`;
  };

  //  care summaries and notes parse
  const parseCareSummariesAndNotes = records => {
    return `
${txtLine}
2) Care summaries and notes

This report only includes care summaries and notes from 2013 and later.
For after-visit summaries, (summaries of your appointments with VA providers), go to your appointment records.

${records
      .map(
        record =>
          `${
            record.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE ||
            record.type === loincCodes.CONSULT_RESULT
              ? `
${record.name}
${txtLineDotted}

Details
  
  Date: ${record.date}
  Location: ${record.location}
  Signed by: ${record.signedBy}
  Co-signed by: ${record.coSignedBy}
  Signed on: ${record.dateSigned}

Notes
  ${record.note}
`
              : `

${record.name}
${txtLineDotted}

Details
  Location: ${record.location}
  Admitted on: ${record.admissionDate}
  Discharged on: ${record.dischargeDate}
  Discharged by: ${record.dischargedBy}

Summary
  ${record.summary}
              `
          }`,
      )
      .join('')}

`;
  };

  //  vaccines parse
  const parseVaccines = records => {
    return `
${txtLine}
3) Vaccines

This list includes vaccines you got at VA health facilities and from providers or pharmacies in our community care network. It may not include vaccines you got outside our network.
For complete records of your allergies and reactions to vaccines, review your allergy records in this report.

${records
      .map(
        record =>
          `
${record.name}
${txtLineDotted}
${`Date received: ${record.date}`}
${`Location: ${record.location}`}
Provider notes
${record.notes.map(note => `${note}`)}
            `,
      )
      .join('')}
    `;
  };

  //  allergies parse
  const parseAllergies = records => {
    return `
${txtLine}
4) Allergies

If you have allergies that are missing from this list, send a secure message to your care team.
${records
      .map(
        record => `
${record.name}
${txtLineDotted}
Date entered: ${record.date}
Signs and symptoms: ${record.reaction.map(reaction => `${reaction}`).join(', ')}
Type of allergy: ${record.type}
Location: ${record.location}
Observed or historical: ${record.observedOrReported}
Provider notes: ${record.notes}
`,
      )
      .join('')}
`;
  };

  //  health conditions parse
  const parseHealthConditions = records => {
    return `
${txtLine}
5) Health conditions

This list includes your current health conditions that VA providers are helping you manage. It may not include conditions non-VA providers are helping you manage.
${records
      .map(
        record => `
${record.name}
${txtLineDotted}
Date: ${record.date}
Provider: ${record.provider}
Provider Notes
Status of health condition: ${record.active}
Location: ${record.facility}
SNOMED Clinical term: ${record.name}
`,
      )
      .join('')}
`;
  };

  //  vitals parse
  const parseVitals = records => {
    const vitalTypes = formatVitals(records);
    return `
${txtLine}
6) Vitals

This list includes vitals and other basic health numbers your providers check at your appointments.
${vitalTypes
      .map(
        vitalType => `
${vitalNameParse(vitalType)}
${txtLineDotted}
  ${records
    .filter(record => record.type === vitalType)
    .map(
      record => `
${record.dateTime}
  Result: ${record.measurement}
  Location: ${record.location}
  Provider Notes: ${record.notes}
`,
    )
    .join('')}
`,
      )
      .join('')}
`;
  };

  return `
Blue Button report

This report includes key information from your VA medical records.
${userFullName.last}, ${userFullName.first}\n
Date of birth: ${dob}\n

What to know about your Blue Button report
- If you print or download your Blue Button report, you'll need to take responsibility for protecting the information in the report.
- Some records in this report are available 36 hours after providers enter them. This includes care summaries and notes, health condition records, and most lab and test results.
- This report doesn't include information you entered yourself. To find information you entered yourself, go back to the previous version of Blue Button on the My HealtheVet website.

Need help?
- If you have questions about this report or you need to add information to your records, send a secure message to your care team.
- If you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.

${txtLine}
The following records have been downloaded:
${txtLineDotted}
  1. Labs and Tests
  2. Care Summaries and Notes
  3. Vaccines
  4. Allergies
  5. Health Conditions
  6. Vitals

${parseLabsAndTests(data.labsAndTests)}
${parseCareSummariesAndNotes(data.notes)}
${parseVaccines(data.vaccines)}
${parseAllergies(data.allergies)}
${parseHealthConditions(data.conditions)}
${parseVitals(data.vitals)}
`;
};
