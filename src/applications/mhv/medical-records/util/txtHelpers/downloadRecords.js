import { txtLine, txtLineDotted } from '../../../shared/util/constants';

/**
 * Helper function to parse consolidated downloads data for txt files.
 *
 * @param {Object} data - The data from content downloads.
 * @returns a string parsed from the data being passed for all record downloads txt.
 */
export const getTxtContent = data => {
  //  Labs and test parse
  const parseLabsAndTests = records => {
    return `
${txtLine}
Lab and test results

If your results are outside the reference range, this doesn't automatically mean you have a health problem. Your provider will explain what your results mean for your health.

${records.map(
      record => `
${record.name} on ${record.date}
${txtLineDotted}
Details about this test

${'type' in record ? `Type of test: ${record.type}` : ''}
${'sampleTested' in record ? `Sample tested: ${record.sampleTested}` : ''}
${'orderedBy' in record ? `Ordered by: ${record.orderedBy}` : ''}
${
        'orderingLocation' in record
          ? `Ordering location: ${record.orderingLocation}`
          : ''
      }
${
        'collectingLocation' in record
          ? `Collecting location: ${record.collectingLocation}`
          : ''
      }
${
        'comments' in record
          ? `Provider notes ${record.comments.map(comment => `\n${comment}`)}`
          : ''
      }

Results

${
        'results' in record
          ? `${
              Array.isArray(record.results)
                ? `${record.results.map(
                    result =>
                      `${'name' in result ? `${result.name}` : ''}
  ${'standardRange' in result ? `Standard range: ${result.standardRange}` : ''}
  ${'status' in result ? `Staus: ${result.status}` : ''}
  ${'labLocation' in result ? `Lab location: ${result.labLocation}` : ''}
  ${
    'interpretation' in result ? `Interpretation: ${result.interpretation}` : ''
  }`,
                  )}`
                : `${record.results}`
            }`
          : ''
      }
`,
    )}`;
  };

  //  care summaries and notes parse
  const parseCareSummariesAndNotes = records => {
    return `
${txtLine}
Care summaries and notes

This report only includes care summaries and notes from 2013 and later.
For after-visit summaries, (summaries of your appointments with VA providers), go to your appointment records.

${records.map(
      record =>
        `${
          record.name === 'Progress note'
            ? `
${record.name}
${txtLineDotted}

Details

  Location: ${record.location}
  Signed by: ${record.signedBy}
  Co-signed by: ${record.coSignedBy}
  Date signed: ${record.dateSigned}

Notes
  ${record.note}
`
            : `

${record.name}
${txtLineDotted}

Details
  Location: ${record.location}
  Discharge date: ${record.dischargeDate}
  Discharged by: ${record.dischargedBy}

Summary
  ${record.summary}
              `
        }`,
    )}

`;
  };

  //  vaccines parse
  const parseVaccines = records => {
    return `
${txtLine}
Vaccines

This list includes vaccines you got at VA health facilities and from providers or pharmacies in our community care network. It may not include vaccines you got outside our network.
For complete records of your allergies and reactions to vaccines, review your allergy records in this report.

${records.map(
      record =>
        `
${record.name}
${txtLineDotted}
${`Date received: ${record.date}`}
${`Location: ${record.location}`}
Provider notes
${record.notes.map(note => `${note}`)}
            `,
    )}
    `;
  };

  //  allergies parse
  const parseAllergies = records => {
    return `
${txtLine}
Allergies

If you have allergies that are missing from this list, send a secure message to your care team.
${records.map(
      record => `
${record.name}
${txtLineDotted}
Date entered: ${record.date}
Signs and symptoms: ${record.reaction.map(reaction => `${reaction}`)}
Type of allergy: ${record.type}
Location: ${record.location}
Observed or historical: ${record.observedOrReported}
Provider notes: ${record.notes}
`,
    )}
`;
  };
  //  health conditions parse

  const parseHealthConditions = records => {
    return `
${txtLine}
Health conditions

This list includes your current health conditions that VA providers are helping you manage. It may not include conditions non-VA providers are helping you manage.
${records.map(
      record => `
${record.name}
${txtLineDotted}
Date entered: ${record.date}
Provider: ${record.provider}
Provider Notes
Status of health condition: ${record.active}
Location: ${record.facility}
SNOMED Clinical term: ${record.name}
`,
    )}
`;
  };

  //  vitals parse

  const parseVitals = records => {
    return `
${txtLine}
Vitals

This list includes vitals and other basic health numbers your providers check at your appointments.
${records.map(
      record => `
${record.name}
${txtLineDotted}
Result: ${record.measurement}
Provider Notes: ${record.notes}
Location: ${record.location}
`,
    )}
`;
  };

  return `
Blue Button report

This report includes key information from your VA medical records.
Date of birth: ${data.dob}\n

What to know about your Blue Button report
- If you print or download your Blue Button report, you'll need to take responsibility for protecting the information in the report.
- Some records in this report are available 36 hours after providers enter them. This includes care summaries and notes, health condition records, and most lab and test results.
- This report doesn't include information you entered yourself. To find information you entered yourself, go back to the previous version of Blue Button on the My HealtheVet website.

Need help?
- If you have questions about this report or you need to add information to your records, send a secure message to your care team.
- If you're ever in crisis and need to talk with someone right away, call the Veterans Crisis line at 988. Then select 1.

${parseLabsAndTests(data.labsAndTests)}
${parseCareSummariesAndNotes(data.notes)}
${parseVaccines(data.vaccines)}
${parseAllergies(data.allergies)}
${parseHealthConditions(data.conditions)}
${parseVitals(data.vitals)}
`;
};
