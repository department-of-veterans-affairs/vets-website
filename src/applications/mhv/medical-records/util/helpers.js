import moment from 'moment-timezone';
import * as Sentry from '@sentry/browser';
import { snakeCase } from 'lodash';
import { generatePdf } from '@department-of-veterans-affairs/platform-pdf/exports';
import { EMPTY_FIELD, interpretationMap } from './constants';
import { txtLine, txtLineDotted } from '../../shared/util/constants';

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} formatted timestamp
 */
export const dateFormat = (timestamp, format = null) => {
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM D, YYYY, h:mm a z');
};

/**
 * @param {Object} nameObject {first, middle, last, suffix}
 * @returns {String} formatted timestamp
 */
export const nameFormat = ({ first, middle, last, suffix }) => {
  let name = `${last}, ${first}`;
  if (middle) name += ` ${middle}`;
  if (suffix) name += `, ${suffix}`;
  return name;
};

/**
 * @param {Object} record
 * @returns {Array of Strings} array of reactions
 */
export const getReactions = record => {
  const reactions = [];
  if (!record || !record.reaction) return reactions;
  record.reaction.forEach(reaction => {
    reaction.manifestation.forEach(manifestation => {
      reactions.push(manifestation.text);
    });
  });
  return reactions;
};

/**
 * Concatenate all the record.category[].text values in a FHIR record.
 *
 * @param {Object} record
 * @returns {String} list of text values, separated by a comma
 */
export const concatCategoryCodeText = record => {
  const textFields = record.category
    .filter(category => category.text)
    .map(category => category.text);

  return textFields.join(', ');
};

/**
 * For every record.interpretation[].text value in a record, find the right display value
 * then concatenate them all together. If no mapping value is found for the code, the code
 * itself is displayed.
 *
 * @param {Object} record
 * @returns {String} list of interpretations, separated by a comma
 */
export const concatObservationInterpretations = record => {
  const textFields = record.interpretation
    .filter(interpretation => interpretation.text)
    .map(
      interpretation =>
        interpretationMap[interpretation.text] || interpretation.text,
    );
  return textFields.join(', ');
};

/**
 * @param {*} observation - a FHIR Observation object
 * @returns {String} the value with units, e.g. "5 ml"
 */
export const getObservationValueWithUnits = observation => {
  if (observation.valueQuantity) {
    return `${observation.valueQuantity.value} ${
      observation.valueQuantity.unit
    }`;
  }
  return null;
};

/**
 * @param {Array} list
 * @returns {String} array of strings, separated by a comma
 */
export const processList = list => {
  if (Array.isArray(list)) {
    if (list?.length > 1) return list.join('. ');
    if (list?.length === 1) return list.toString();
  }
  return EMPTY_FIELD;
};

/**
 * @param {Error} error javascript error
 * @param {String} page name of the page sending the error
 * @returns {undefined}
 */
export const sendErrorToSentry = (error, page) => {
  Sentry.captureException(error);
  Sentry.captureMessage(
    `MHV - Medical Records - ${page} - PDF generation error`,
  );
};

/**
 * Macro case is naming with all letters Capitalized but the words are joined with _ ( underscore)
 * @param {String} str string
 * @returns {String} MACRO_CASE
 */
export const macroCase = str => {
  return snakeCase(str).toUpperCase();
};

/**
 * @param {Any} obj
 * @returns {Boolean} true if obj is an array and has at least one item
 */
export const isArrayAndHasItems = obj => {
  return Array.isArray(obj) && obj.length;
};

/**
 * Create a pdf using the platform pdf generator tool
 * @param {Boolean} pdfName what the pdf file should be named
 * @param {Object} pdfData data to be passed to pdf generator
 * @param {String} sentryError name of the app feature where the call originated
 * @param {Boolean} runningUnitTest pass true when running unit tests because calling generatePdf will break unit tests
 * @param {String} templateId the template id in the pdfGenerator utility, defaults to medicalRecords
 */
export const makePdf = async (
  pdfName,
  pdfData,
  sentryError,
  runningUnitTest,
  templateId,
) => {
  try {
    if (!runningUnitTest) {
      await generatePdf(templateId || 'medicalRecords', pdfName, pdfData);
    }
  } catch (error) {
    sendErrorToSentry(error, sentryError);
  }
};

/**
 * Extract a contained resource from a FHIR resource's "contained" array.
 * @param {Object} resource a FHIR resource (e.g. AllergyIntolerance)
 * @param {String} referenceId an internal ID referencing a contained resource
 * @returns the specified contained FHIR resource, or null if not found
 */
export const extractContainedResource = (resource, referenceId) => {
  if (resource && isArrayAndHasItems(resource.contained) && referenceId) {
    // Strip the leading "#" from the reference.
    const strippedRefId = referenceId.substring(1);
    const containedResource = resource.contained.find(
      containedItem => containedItem.id === strippedRefId,
    );
    return containedResource || null;
  }
  return null;
};

/**
 * Download a text file
 * @param {String} content text file content
 * @param {String} fileName name for the text file
 */
export const generateTextFile = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

/**
 * Returns the date and time for file download name
 * @param {Object} user user object from redux store
 * @returns the user's name with the date and time in the format John-Doe-M-D-YYYY_hhmmssa
 */
export const getNameDateAndTime = user => {
  return `${user.userFullName.first}-${user.userFullName.last}-${moment()
    .format('M-D-YYYY_hhmmssa')
    .replace(/\./g, '')}`;
};

/**
 * Helper function to retrieve details for a given item.
 *
 * If a matching item is found in the list, those details are returned.
 * If no matching item is found, it fetches the details for the given id using getDetail().
 *
 * @param {string} id - The ID of the detail to retrieve.
 * @param {Array} list - The list of detail object to search in.
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Function} getDetail - The function to fetch detail's object by ID from an API.
 * @param {string} actionsGetFromList - The action type to dispatch when a matching item is found in the list.
 * @param {string} actionsGet - The action type to dispatch when a matching item is not found in the list.
 */
export const dispatchDetails = async (
  id,
  list,
  dispatch,
  getDetail,
  actionsGetFromList,
  actionsGet,
) => {
  const matchingItem = list && list.find(item => item.id === id);

  if (matchingItem) {
    dispatch({ type: actionsGetFromList, response: matchingItem });
  } else {
    const response = await getDetail(id);
    dispatch({ type: actionsGet, response });
  }
};

/**
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
