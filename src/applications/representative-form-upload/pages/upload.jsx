import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import FileField from 'platform/forms-system/src/js/fields/FileField';
import {
  UPLOAD_TITLE,
  UPLOAD_DESCRIPTION,
  FORM_UPLOAD_OCR_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
} from '../config/constants';
import {
  getFormContent,
  onCloseAlert,
  createPayload,
  parseResponse,
} from '../helpers';
import {
  CustomAlertPage,
  emptyObjectSchema,
  uploadTitleAndDescription,
} from './helpers';
import SupportingEvidenceViewField from '../components/SupportingEvidenceViewField';

const { formNumber, title, message } = getFormContent();
const baseURL = `${environment.API_URL}/accredited_representative_portal/v0`;
const fileUploadUrl = `${baseURL}/representative_form_upload`;
const warningsPresent = formData =>
  formData.uploadedFile?.warnings?.length > 0 ||
  formData.supportingDocuments?.warnings?.length > 0;

export const uploadPage = {
  uiSchema: {
    ...uploadTitleAndDescription,
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl,
        title,
        hint: 'Your file must be .pdf format.',
        formNumber,
        required: () => true,
        // Disallow uploads greater than 25 MB
        maxFileSize: 25000000,
        updateUiSchema: formData => {
          return {
            'ui:title': warningsPresent(formData)
              ? message.replace('Upload ', '')
              : message,
          };
        },
      }),
    },
    'ui:objectViewField': SupportingEvidenceViewField,
    supportingDocuments: {
      'ui:title': (
        <div className="vads-u-font-size--h3 vads-u-font-weight--bold">
          Upload supporting evidence
        </div>
      ),
      'ui:description': Object.freeze(
        <>
          <p className="form-686c__upload-text">
            Select supporting documents to upload.
          </p>
          <p className="form-686c__upload-hint">
            You can only upload one file no larger than 25MB. Your file can be
            .pdf, .png or .jpg.
          </p>
        </>,
      ),
      'ui:field': FileField,
      'ui:confirmationField': ({ formData }) => ({
        data: formData?.map(item => item.name || item.fileName),
        label: UPLOAD_TITLE,
      }),
      'ui:options': {
        hideLabelText: false,
        showFieldLabel: true,
        buttonText: 'Upload file',
        addAnotherLabel: 'Upload another file',
        ariaLabelAdditionalText: `${UPLOAD_TITLE}. ${UPLOAD_DESCRIPTION}`,
        attachmentType: {
          'ui:title': 'File type',
        },
        attachmentDescription: {
          'ui:title': 'Document description',
        },
        fileUploadUrl: `${baseURL}/upload_supporting_documents`,
        fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
        createPayload,
        parseResponse,
        keepInPageOnReview: true,
        classNames: 'schemaform-file-upload',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:uploadTitle': emptyObjectSchema,
      'view:uploadFormNumberDescription': emptyObjectSchema,
      'view:uploadDescription': emptyObjectSchema,
      uploadedFile: fileInputSchema,
      supportingDocuments: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            fileName: {
              type: 'string',
            },
            fileSize: {
              type: 'integer',
            },
            confirmationNumber: {
              type: 'string',
            },
            errorMessage: {
              type: 'string',
            },
            uploading: {
              type: 'boolean',
            },
          },
        },
      },
    },
    required: ['uploadedFile'],
  },
};

/** @type {CustomPageType} */
export function UploadPage(props) {
  const warnings = (props.data?.uploadedFile?.warnings || []).concat(
    props.data?.supportingDocuments?.warnings || [],
  );
  const alert =
    warnings?.length > 0
      ? FORM_UPLOAD_OCR_ALERT(formNumber, onCloseAlert, warnings)
      : FORM_UPLOAD_INSTRUCTION_ALERT(onCloseAlert);
  return <CustomAlertPage {...props} alert={alert} />;
}

UploadPage.propTypes = {
  data: PropTypes.shape({
    uploadedFile: PropTypes.shape({
      warnings: PropTypes.arrayOf(PropTypes.string),
    }),
    supportingDocuments: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        confirmationNumber: PropTypes.string,
        errorMessage: PropTypes.string,
        uploading: PropTypes.bool,
        warnings: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
  }).isRequired,
};
