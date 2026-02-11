import {
  generatePdfScaffold,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  txtLineDotted,
  getNameDateAndTime,
  formatNameFirstLast,
  formatUserDob,
} from '@department-of-veterans-affairs/mhv/exports';

import {
  generateLabsIntro,
  generateGenericContent,
} from './pdfHelpers/labsAndTests';

import {
  OBSERVATION_DISPLAY_LABELS,
  LABS_AND_TESTS_DISPLAY_LABELS,
} from './constants';

export const pdfPrinter = ({ record, user }) => {
  const { title, subject, subtitles } = generateLabsIntro(record);
  const scaffold = generatePdfScaffold(user, title, subject);
  const pdfData = {
    ...scaffold,
    subtitles,
    ...generateGenericContent(record),
  };
  const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;

  return {
    body: pdfData,
    title: pdfName,
  };
};

export const txtPrinter = ({ record, user }) => {
  const content = [
    `${crisisLineHeader}\n`,
    `${record.name}`,
    `${formatNameFirstLast(user.userFullName)}`,
    `Date of birth: ${formatUserDob(user)}`,
    `${reportGeneratedBy}`,
    `${LABS_AND_TESTS_DISPLAY_LABELS.DATE}: ${record.date}`,
    `${txtLine}\n`,
    record.testCode
      ? `${LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE}: ${record.testCodeDisplay}`
      : `${LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE}: None Noted`,
    record.sampleTested
      ? `${LABS_AND_TESTS_DISPLAY_LABELS.SAMPLE_TESTED}: ${record.sampleTested}`
      : `${LABS_AND_TESTS_DISPLAY_LABELS.SAMPLE_TESTED}: None Noted`,
    record.bodySite
      ? `${LABS_AND_TESTS_DISPLAY_LABELS.BODY_SITE}: ${record.bodySite}`
      : `${LABS_AND_TESTS_DISPLAY_LABELS.BODY_SITE}: None Noted`,
    record.orderedBy
      ? `${LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY}: ${record.orderedBy}`
      : `${LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY}: None Noted`,
    record.location
      ? `${LABS_AND_TESTS_DISPLAY_LABELS.LOCATION}: ${record.location}`
      : `${LABS_AND_TESTS_DISPLAY_LABELS.LOCATION}: None Noted`,
    record.comments
      ? `${LABS_AND_TESTS_DISPLAY_LABELS.COMMENTS}: ${record.comments}`
      : `${LABS_AND_TESTS_DISPLAY_LABELS.COMMENTS}: None Noted`,
    `${txtLine}\n`,
  ];
  const results = [
    'Results: \n',
    'Your provider will review your results. If you need to do anything, your provider will contact you. If you have questions, send a message to the care team that ordered this test.\n',
    'Note: If you have questions about more than 1 test ordered by the same care team, send 1 message with all of your questions.\n',
    `${record.result}`,
  ];
  content.push(...results);
  if (record.observations) {
    const observations = [
      'Results: \n',
      ...record.observations.map(entry =>
        [
          `${txtLine}`,
          `${entry.testCode}`,
          `${txtLineDotted}`,
          `${OBSERVATION_DISPLAY_LABELS.VALUE}: ${entry.value.text}`,
          `${OBSERVATION_DISPLAY_LABELS.REFERENCE_RANGE}: ${
            entry.referenceRange
          }`,
          `${OBSERVATION_DISPLAY_LABELS.STATUS}: ${entry.status}`,
          entry.bodySite
            ? `${OBSERVATION_DISPLAY_LABELS.BODY_SITE}: ${entry.bodySite}`
            : `${OBSERVATION_DISPLAY_LABELS.BODY_SITE}: None Noted`,
          entry.sampleTested
            ? `${OBSERVATION_DISPLAY_LABELS.SAMPLE_TESTED}: ${
                entry.sampleTested
              }`
            : `${OBSERVATION_DISPLAY_LABELS.SAMPLE_TESTED}: None Noted`,
          entry.comments
            ? `${OBSERVATION_DISPLAY_LABELS.COMMENTS}: ${entry.comments}`
            : `${OBSERVATION_DISPLAY_LABELS.COMMENTS}: None Noted`,
        ]
          .filter(line => line)
          .join(`\n`),
      ),
    ];
    content.push(...observations);
  }

  const txt = content.filter(line => line).join(`\n`);
  const txtName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}.txt`;
  return {
    title: txtName,
    body: txt,
  };
};
