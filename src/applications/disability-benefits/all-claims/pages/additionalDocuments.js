import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import environment from '../../../../platform/utilities/environment';
import { additionalDocumentDescription } from '../content/additionalDocuments';

// import full526EZSchema from '../config/schema.js';

// TODO: Use the FIFTY_MB const from Mark's PR once it's merged
const FIFTY_MB = 52428800;

// TODO: Use the attachments definition once Mark's PR gets merged
const documentTypes526 = [
  { value: 'L015', label: 'Buddy/Lay Statement' },
  { value: 'L018', label: 'Civilian Police Reports' },
  { value: 'L029', label: 'Copy of a DD214' },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  { value: 'L703', label: 'Goldmann Perimetry Chart/Field Of Vision Chart' },
  { value: 'L034', label: 'Military Personnel Record' },
  { value: 'L478', label: 'Medical Treatment Records - Furnished by SSA' },
  { value: 'L048', label: 'Medical Treatment Record - Government Facility' },
  { value: 'L049', label: 'Medical Treatment Record - Non-Government Facility' },
  { value: 'L023', label: 'Other Correspondence' },
  { value: 'L070', label: 'Photographs' },
  { value: 'L450', label: 'STR - Dental - Photocopy' },
  { value: 'L451', label: 'STR - Medical - Photocopy' },
  { value: 'L222', label: 'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance' },
  { value: 'L228', label: 'VA Form 21-0781 - Statement in Support of Claim for PTSD' },
  { value: 'L229', label: 'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault' },
  { value: 'L102', label: 'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance' },
  { value: 'L107', label: 'VA Form 21-4142 - Authorization To Disclose Information' },
  { value: 'L827', label: 'VA Form 21-4142a - General Release for Medical Provider Information' },
  { value: 'L115', label: 'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability' },
  { value: 'L117', label: 'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904' },
  { value: 'L159', label: 'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant' },
  { value: 'L133', label: 'VA Form 21-674 - Request for Approval of School Attendance' },
  { value: 'L139', label: 'VA Form 21-686c - Declaration of Status of Dependents' },
  { value: 'L149', label: 'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability' }
];
const attachments = {
  type: 'array',
  items: {
    type: 'object',
    required: ['name', 'attachmentId'],
    properties: {
      name: {
        type: 'string'
      },
      confirmationCode: {
        type: 'string'
      },
      attachmentId: {
        type: 'string',
        'enum': documentTypes526.map(doc => doc.value),
        enumNames: documentTypes526.map(doc => doc.label),
      }
    }
  }
};


export const uiSchema = {
  additionalDocuments: Object.assign({},
    fileUploadUI('Lay statements or other evidence', {
      itemDescription: 'Adding additional evidence:',
      fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
      addAnotherLabel: 'Add Another Document',
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'txt'],
      maxSize: FIFTY_MB,
      createPayload: (file) => {
        const payload = new FormData();
        payload.append('supporting_evidence_attachment[file_data]', file);

        return payload;
      },
      parseResponse: (response, file) => {
        return {
          name: file.name,
          confirmationCode: response.data.attributes.guid
        };
      },
      // this is the uiSchema passed to FileField for the attachmentId schema
      // FileField requires this name be used
      attachmentSchema: {
        'ui:title': 'Document type'
      },
      // this is the uiSchema passed to FileField for the name schema
      // FileField requires this name be used
      attachmentName: {
        'ui:title': 'Document name'
      }
    }),
    { 'ui:description': additionalDocumentDescription }
  )
};

export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    additionalDocuments: attachments
  }
};
