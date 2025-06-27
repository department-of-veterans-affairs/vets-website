import React from 'react';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  titleUI,
  titleSchema,
  selectUI,
  selectSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
// import VaDateField from 'platform/forms-system/src/js/web-component-fields/VaDateField';

// export const dateNoHint = options => {
//     const {
//         hint,
//         title,
//         errorMessages,
//         required,
//         dataDogHidden = false,
//         ...uiOptions
//       } = typeof options === 'object' ? options : { title: options };

//       const uiTitle = title ?? 'Date';

//       return {
//         'ui:title': uiTitle,
//         'ui:hint': hint,
//         'ui:webComponentField': VaDateField,
//         'ui:required': required,
//         'ui:errorMessages': {
//           pattern:
//             errorMessages?.pattern || 'Please enter a valid current or past date',
//           required: errorMessages?.required || 'Please enter a date',
//         },
//         'ui:options': {
//           ...uiOptions,
//         },
//         'ui:reviewField': ({ children }) => (
//           <div className="review-row">
//             <dt>{uiTitle}</dt>
//             <dd
//               className={dataDogHidden ? 'dd-privacy-hidden' : undefined}
//               data-dd-action-name={dataDogHidden ? uiTitle : undefined}
//             >
//               {children.props.formData && (
//                 <>
//                   {new Date(
//                     `${children.props.formData}T00:00:00`,
//                   ).toLocaleDateString('en-us', localeDateStringOptions)}
//                 </>
//               )}
//             </dd>
//           </div>
//         ),
//       };
//     };

export const claimIdentifyingNumberOptions = [
  'PDI number',
  'Claim control number',
];

export const claimIdentifyingNumber = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim identifying number`,
      'The PDI number or claim control number is used to identify the original claim that was submitted. These can be found on the letter you received from CHAMPVA requesting further action on your claim.',
    ),
    pdiOrClaimNumber: selectUI({
      title: 'Is this a PDI or claim control number?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      pdiOrClaimNumber: selectSchema(claimIdentifyingNumberOptions),
    },
  },
};

export const claimType = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim type`,
    ),
    claimType: radioUI({
      title: 'What type of claim was the original submission for?',
      labels: {
        medical: 'Medical claim',
        pharmacy: 'Pharmacy claim',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimType'],
    properties: {
      titleSchema,
      claimType: radioSchema(['medical', 'pharmacy']),
    },
  },
};

export const medicalClaimDetails = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim details`,
      'Enter the details for your claim to help us find your original claim.',
    ),
    providerName: textUI('Provider name'),
    beginningDateOfService: {
      ...currentOrPastDateUI({
        title: 'Beginning date of service',
      }),
    },
    endDateOfService: {
      ...currentOrPastDateUI({
        title: 'End date of service date',
        hint:
          'Enter end date of service if service occurred over multiple days',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['providerName', 'beginningDateOfService', 'endDateOfService'],
    properties: {
      titleSchema,
      providerName: textSchema,
      beginningDateOfService: currentOrPastDateSchema,
      endDateOfService: currentOrPastDateSchema,
    },
  },
};

export const medicalUploadSupportingDocs = {
  uiSchema: {
    ...titleUI(
      'Upload supporting documents for your medical claim',
      <>
        <p>You’ll need to submit the following documents:</p>
        <ul>
          <li>
            Copies of documents including missing information listed ont he
            letter you received from CHAMPVA, <b> and</b>
          </li>
          <li>The documents that you originally submitted with your claim</li>
        </ul>
        <p>
          These documents may be an itemized or a superbill from your provider
          an explanation of benefits from your insurance company.
        </p>
        <a href="https://www.va.gov/resources/how-to-file-a-champva-claim/">
          Learn how to file a CHAMPVA claim
        </a>
      </>,
    ),
    ...fileUploadBlurb,
    medicalUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicalUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      medicalUpload: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export const pharmacyClaimDetails = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim details`,
      'Enter the details for your claim to help us find your original claim.',
    ),
    medicationName: textUI('Medication name'),
    prescriptionFillDate: {
      ...currentOrPastDateUI({
        title: 'Prescription fill date',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicationName', 'prescriptionFillDate'],
    properties: {
      titleSchema,
      medicationName: textSchema,
      prescriptionFillDate: currentOrPastDateSchema,
    },
  },
};

export const pharmacyClaimUploadDocs = {
  uiSchema: {
    ...titleUI(
      'Upload supporting documents for your pharmacy claim',
      <>
        <p>You’ll need to submit the following documents:</p>
        <ul>
          <li>
            Copies of documents with missing information we requested in the
            letter we mailed you, <b> and</b>
          </li>
          <li>All documents you submitted with your original claim</li>
        </ul>
        <p>
          These documents may be an itemized or a superbill from your provider
          an explanation of benefits from your insurance company.
        </p>
        <a href="https://www.va.gov/resources/how-to-file-a-champva-claim/">
          Learn how to file a CHAMPVA claim
        </a>
      </>,
    ),
    ...fileUploadBlurb,
    pharmacyUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
    }),
  },
  schema: {
    type: 'object',
    required: ['pharmacyUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      pharmacyUpload: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
