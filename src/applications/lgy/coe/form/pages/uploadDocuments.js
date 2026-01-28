import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { serviceStatuses } from '../constants';
import { DOCUMENT_TYPES, FILE_TYPES } from '../../status/constants';
import { UploadDocumentsReview } from '../components/UploadDocumentsReview';

const requiredDocumentMessages = {
  [serviceStatuses.VETERAN]: (
    <p>
      You’ll need to upload a copy of your discharge or separation papers
      (DD214) showing character of service.
    </p>
  ),
  [serviceStatuses.ADSM]: (
    <>
      <p>You’ll need to upload a Statement of Service.</p>
      <va-accordion>
        <va-accordion-item open="true">
          <h3 className="vads-u-font-size--h6" slot="headline">
            Service Statement
          </h3>
          <p>
            The statement of service can be signed by, or by direction of, the
            adjutant, personnel officer, or commander of your unit or higher
            headquarters. The statement may be in any format; usually a standard
            or bulleted memo is sufficient. It should identify you by name and
            social security number and provide: (1) your date of entry on your
            current active-duty period and (2) the duration of any time lost (or
            a statement noting there has been no time lost). Generally, this
            should be on military letterhead.
          </p>
        </va-accordion-item>
      </va-accordion>
    </>
  ),
  [serviceStatuses.NADNA]: (
    <>
      <p>You’ll need to upload these documents:</p>
      <ul>
        <li>Statement of Service</li>
        <li>
          Creditable number of years served or Retirement Points Statement or
          equivalent
        </li>
      </ul>
    </>
  ),
  [serviceStatuses.DNANA]: (
    <>
      <p>You’ll need to upload these documents:</p>
      <ul>
        <li>
          Separation and Report of Service (NGB Form 22) for each period of
          National Guard service
        </li>
        <li>Retirement Points Accounting (NGB Form 23)</li>
        <li>
          Proof of character of service such as a DD214 <strong>or</strong>{' '}
          Department of Defense Discharge Certificate
        </li>
      </ul>
    </>
  ),
  [serviceStatuses.DRNA]: (
    <>
      <p>You’ll need to upload these documents:</p>
      <ul>
        <li>Retirement Point Accounting</li>
        <li>
          Proof of honorable service for at least six years such as a DD214 or
          Department of Defense Discharge Certificate
        </li>
      </ul>
    </>
  ),
};

export const getUiSchema = () => ({
  ...titleUI(
    'Upload your documents',
    ({ formData }) => requiredDocumentMessages[formData.identity] || null,
  ),
  files2: fileInputMultipleUI({
    title: 'Upload your documents',
    required: true,
    accept: FILE_TYPES.map(type => `.${type}`).join(','),
    hint:
      'You can upload a .jpg, .pdf, or a .png file. Be sure that your file size is 99MB or less for a PDF and 50MB or less for a .jpg or .png',
    disallowEncryptedPdfs: true,
    maxFileSize: 103809024, // 99MB in bytes
    minFileSize: 1024,
    fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
    formNumber: '26-1880',
    errorMessages: {
      additionalInput: 'Choose a document type',
    },
    additionalInputRequired: true,
    additionalInput: (error, data) => {
      const { attachmentType } = data || {};
      return (
        <VaSelect
          required
          error={error}
          value={attachmentType}
          label="Document type"
          name="attachmentType"
        >
          {DOCUMENT_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </VaSelect>
      );
    },
    additionalInputUpdate: (instance, error, data) => {
      instance.setAttribute('error', error);
      if (data?.attachmentType) {
        instance.setAttribute('value', data.attachmentType);
      }
    },
    handleAdditionalInput: e => {
      const { value } = e.detail;
      if (value === '') return null;
      return { attachmentType: e.detail.value };
    },
    reviewField: UploadDocumentsReview,
  }),
});

export const uploadDocumentsSchema = {
  schema: {
    type: 'object',
    properties: {
      files2: fileInputMultipleSchema(),
    },
    required: ['files2'],
  },
};

export default uploadDocumentsSchema;
