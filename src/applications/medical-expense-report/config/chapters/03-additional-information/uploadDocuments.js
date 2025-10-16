import React from 'react';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';

const documentList = [
  {
    id: '1',
    name: 'Birth Certificate',
  },
  {
    id: '2',
    name: 'Copy of a DD214',
  },
  {
    id: '3',
    name: 'Court papers / documents',
  },
  {
    id: '4',
    name: 'Death Certificate',
  },
  {
    id: '5',
    name: 'Disability Benefits Questionnaire (DBQ)',
  },
  {
    id: '6',
    name: 'Divorce Decree',
  },
  {
    id: '7',
    name: 'Goldmann Perimetry Chart / Field of Vision Chart',
  },
  {
    id: '8',
    name: 'Marriage Certificate',
  },
  {
    id: '9',
    name: 'Medical Treatment Record - Non-Government Facility',
  },
  {
    id: '10',
    name: 'Military Personnel Record',
  },
  {
    id: '11',
    name: 'Photographs',
  },
  {
    id: '12',
    name: 'VA Form 21-686c - Declaration of Status of Dependents',
  },
  {
    id: '13',
    name: 'VA Form 21-674 - Request for Approval of School Attendance',
  },
  {
    id: '14',
    name: 'VA Form 21-4142 - Authorization To Disclose Information',
  },
  {
    id: '15',
    name: 'VA Form 21-4142a - General Release for Medical Provider Information',
  },
  {
    id: '16',
    name:
      'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C 3901-3904',
  },
  {
    id: '17',
    name:
      'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
  },
  {
    id: '18',
    name:
      'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaption Grant',
  },
  {
    id: '19',
    name:
      'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
  },
  {
    id: '20',
    name:
      'VA Form 21-0779 - Request for Nursing home Information in Connection with Claim for Aid & Attendance',
  },
  {
    id: '21',
    name:
      'VA Form 21-2680 - Examination for Household Status or Permanent Need for Regular Aid & Attendance',
  },
  {
    id: '22',
    name:
      'VA Form 21-0781 - Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)',
  },
  {
    id: '23',
    name:
      'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
  },
  {
    id: '24',
    name: 'Other Correspondence',
  },
  {
    id: '25',
    name: 'STR - Dental - Photocopy',
  },
  {
    id: '26',
    name: 'STR - Medical - Photocopy',
  },
];

const UploadMessage = (
  <p>
    <strong>Note:</strong> You can choose to submit your supporting documents
    and additional evidence after submitting your pension claim. You’ll need to
    submit them by mail or upload them using the Claim Status Tool.
  </p>
);

export default {
  uiSchema: {
    ...titleUI(
      'Submit your supporting documents',
      'You can submit your supporting documents and additional evidence with your pension claim.',
    ),
    files: fileInputMultipleUI({
      title: 'Select a file to upload',
      hint:
        'You can upload a .pdf, .jpg, .jpeg, or .png file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).',
      required: false,
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      maxFileSize: 1024 * 1024 * 5,
      accept: '.pdf,.jpg,.jpeg,.png',
      formNumber: '21P-8416',
      errorMessages: {
        additionalInput: 'Select a type of document',
      },
      additionalInputRequired: true,
      additionalInput: () => {
        return (
          <VaSelect required label="What type of document is this?">
            {documentList.map(doc => (
              <option key={doc.id} value={doc.name}>
                {doc.name}
              </option>
            ))}
          </VaSelect>
        );
      },
      additionalInputUpdate: (instance, error, data) => {
        instance.setAttribute('error', error);
        if (data) {
          instance.setAttribute('value', data.documentStatus);
        }
      },
      handleAdditionalInput: e => {
        const { value } = e.detail;
        if (value === '') return null;
        return { documentStatus: e.detail.value };
      },
    }),
    'view:uploadMessage': {
      'ui:description': UploadMessage,
    },
  },
  schema: {
    type: 'object',
    properties: {
      files: fileInputMultipleSchema(),
      'view:uploadMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};
