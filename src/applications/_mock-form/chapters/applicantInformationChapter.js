// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const { fullName, ssn } = commonDefinitions;

const applicantInformationChapter = {
  title: 'Chapter Title: Applicant Information (Basic Form elements)',
  pages: {
    applicantInformation: {
      path: 'applicant-information',
      title: 'Section Title: Applicant Information',
      uiSchema: {
        fullName: fullNameUI,
        ssn: ssnUI,
      },
      schema: {
        type: 'object',
        required: fullName,
        properties: {
          fullName,
          ssn,
        },
      },
    },
  },
};

export default applicantInformationChapter;
