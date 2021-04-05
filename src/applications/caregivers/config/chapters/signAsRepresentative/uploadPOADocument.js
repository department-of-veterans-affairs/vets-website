import React from 'react';
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { representativeFields } from 'applications/caregivers/definitions/constants';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import environment from 'platform/utilities/environment';

// const { representative } = fullSchema.properties;
// const veteranProps = veteran.properties;
// const { address, phone } = fullSchema.definitions;

const DocumentUploadDescription = () => {
  return (
    <section>
      <p>
        If you’re signing as a legal representative, you can upload supporting
        documents showing your authority to complete this application on behalf
        of the Veteran.
      </p>

      <h3 style={{ padding: 0, marginBottom: '1.3em' }}>
        Upload your supporting documentation
      </h3>

      <p>
        You can upload document in a .pdf, .jpeg, or .png file format. You’ll
        first need to scan a copy of your document onto your computer or mobile
        phone. You can upload the document from there.
      </p>

      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>File types you. can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 25MB</li>
      </ul>

      <em>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow internet connection.
      </em>
    </section>
  );
};

const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['attachmentId', 'name'],
    properties: {
      name: {
        type: 'string',
      },
      size: {
        type: 'integer',
      },
      confirmationCode: {
        type: 'string',
      },
      attachmentId: {
        type: 'string',
        enum: ['1', '2', '3', '4', '5', '6', '7'],
        enumNames: [
          'DD214',
          'DD215 (used to correct or make additions to the DD214)',
          'WD AGO 53-55 (report of separation used prior to 1950)',
          'Other discharge papers (like your DD256, DD257, or NGB22)',
          'Official documentation of a military award (like a Purple Heart, Medal of Honor, or Silver Star)',
          'Disability rating letter from the Veterans Benefit Administration (VBA)',
          'Other official military document',
        ],
      },
    },
  },
};

export default {
  uiSchema: {
    'ui:title': '',
    'ui:description': DocumentUploadDescription(),
    [representativeFields.documentUpload]: fileUploadUI('', {
      buttonText: 'Upload',
      classNames: 'poa-document-upload',
      multiple: false,
      fileUploadUrl: `${environment.API_URL}/v0/caregiver_attachments`,
      fileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'rtf', 'png'],
      maxSize: 1024 * 1024 * 10,
      hideLabelText: true,
      createPayload: file => {
        const payload = new FormData();
        payload.append('caregiver_attachment[file_data]', file);
        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
        size: file.size,
      }),
      attachmentSchema: {
        'ui:title': 'Document type',
      },
      attachmentName: {
        'ui:title': 'Document name',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [representativeFields.documentUpload]: attachmentsSchema,
    },
  },
};
