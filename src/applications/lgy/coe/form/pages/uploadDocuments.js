import React from 'react';
import { useSelector } from 'react-redux';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { serviceStatuses, entitlementRestorationOptions } from '../constants';
import { FILE_TYPES } from '../../status/constants';
import { UploadDocumentsReview } from '../components/UploadDocumentsReview';
import UploadInformation from '../components/UploadInformation';
import DocumentsNeeded from '../components/DocumentsNeeded';

const containsOneTimeRestoration = formData =>
  formData?.relevantPriorLoans?.some(
    loan =>
      loan?.entitlementRestoration ===
      entitlementRestorationOptions.ONE_TIME_RESTORATION,
  );

export const DocumentTypeSelect = () => {
  const formData = useSelector(state => state?.form?.data);
  const requiredDocumentTypes = [];
  if (formData?.identity === serviceStatuses.VETERAN) {
    requiredDocumentTypes.push('Discharge papers (DD214)');
  } else if (formData?.identity === serviceStatuses.ADSM) {
    requiredDocumentTypes.push('Statement of Service');
    if (formData?.militaryHistory?.purpleHeartRecipient) {
      requiredDocumentTypes.push('Purple Heart Certificate');
    }
  } else if (formData?.identity === serviceStatuses.NADNA) {
    requiredDocumentTypes.push(
      'Statement of Service',
      'Creditable number of years',
      'Retirement Points Statement',
    );
  } else if (
    formData?.identity === serviceStatuses.DNANA ||
    formData?.identity === serviceStatuses.DRNA
  ) {
    requiredDocumentTypes.push(
      'Separation and Report of Service',
      'Retirement Points Accounting',
      'Proof of character of service',
      'Department of Defense Discharge Certificate',
    );
  }

  if (containsOneTimeRestoration(formData)) {
    requiredDocumentTypes.push('Loan evidence');
  }

  return (
    <VaSelect required label="Document type" name="attachmentType">
      {requiredDocumentTypes.map(type => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </VaSelect>
  );
};

export const getUiSchema = () => ({
  ...titleUI('Upload your documents', ({ formData }) => {
    const hasOneTimeRestoration = containsOneTimeRestoration(formData);
    return (
      <>
        <DocumentsNeeded
          formData={formData}
          hasOneTimeRestoration={hasOneTimeRestoration}
        />
        <UploadInformation
          formData={formData}
          hasOneTimeRestoration={hasOneTimeRestoration}
        />
      </>
    );
  }),
  files2: fileInputMultipleUI({
    title: 'Upload your documents',
    required: true,
    accept: FILE_TYPES.map(type => `.${type}`).join(','),
    hint:
      'You can upload a .jpg, .pdf, or a .png file. Be sure that your file size is 99MB or less for a PDF and 50MB or less for a .jpg or .png',
    disallowEncryptedPdfs: true,
    fileSizesByFileType: {
      pdf: {
        maxFileSize: 103809024, // 99MB in bytes
        minFileSize: 1024, // 1KB
      },
      jpg: {
        maxFileSize: 52428800, // 50MB in bytes
        minFileSize: 1024, // 1KB
      },
      png: {
        maxFileSize: 52428800, // 50MB in bytes
        minFileSize: 1024, // 1KB
      },
    },
    fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
    formNumber: '26-1880',
    errorMessages: {
      additionalInput: 'Choose a document type',
    },
    additionalInputRequired: true,
    additionalInput: () => <DocumentTypeSelect />,
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
