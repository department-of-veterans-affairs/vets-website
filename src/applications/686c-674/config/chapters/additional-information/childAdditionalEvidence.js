import React from 'react';
import omit from 'lodash/omit';
import {
  fileInputUI,
  fileInputSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { ChildAdditionalEvidence } from '../../../components/ChildAdditionalEvidence';

const childSupportingDocuments = omit(fileInputSchema, 'properties.warnings');

const schema = {
  type: 'object',
  properties: {
    childAdditionalEvidence: {
      type: 'object',
      properties: {
        'view:additionalEvidenceDescription': {
          type: 'object',
          properties: {},
        },
        childSupportingDocuments,
      },
    },
  },
};

const TITLE = {
  confirmationCode: 'Confirmation code',
  name: 'Name',
  size: 'Size',
  isEncrypted: 'Encrypted file',
};

function renderBytes(bytes) {
  const units = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  // eslint-disable-next-line no-restricted-properties
  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(2)} ${units[index]}`;
}

const shouldRenderIsEncrypted = (keyname, value) => {
  if (keyname === 'isEncrypted') {
    return value ? 'Yes' : 'No';
  }

  if (keyname === 'size') {
    return renderBytes(value);
  }

  return value;
};

const uiSchema = {
  ...titleUI('Upload your supporting evidence to add your child'),
  childAdditionalEvidence: {
    'view:additionalEvidenceDescription': {
      'ui:description': ChildAdditionalEvidence,
    },
    childSupportingDocuments: {
      ...fileInputUI({
        title: 'Upload supporting documents',
        name: `file-input`,
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        formNumber: '686C-674-V2',
      }),
      'ui:objectViewField': ({ formData }) => {
        const realFormData = omit(formData, ['warnings']);

        return Object.entries(realFormData).map(([keyName, value]) => (
          <div className="review-row" key={keyName}>
            <dt>{TITLE[keyName]}</dt>
            <dd>{shouldRenderIsEncrypted(keyName, value)}</dd>
          </div>
        ));
      },
    },
  },
};

export const childAdditionalEvidence = {
  uiSchema,
  schema,
};
