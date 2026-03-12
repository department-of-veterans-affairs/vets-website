import React from 'react';
import {
  fileInputMultipleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { burialUploadUI } from '../../../utils/upload';
import { validateFileUploads } from '../../../utils/validation';

export default {
  uiSchema: {
    ...titleUI('Additional documents'),
    'ui:description': (
      <>
        <p>
          Upload any additional supporting documents with your application here.
        </p>
        <h4>Medical Records</h4>
        <p>
          If you’re applying for a burial allowance for a service-connected
          death, you can submit supporting documents about their medical
          information.
        </p>
        <p>
          <strong>Note:</strong> It’s your choice whether you want to submit
          supporting documents. This information may help us process your
          application and confirm details about the deceased Veteran’s medical
          information at the time of their death.
        </p>
        <h5>If you have access</h5>
        <p>
          If you have access to the Veteran’s medical records, you can submit
          copies of them with your online application or send them to us by
          mail.
        </p>
        <h5>If you don’t have access</h5>
        <p>
          If you don’t have access to the Veteran’s medical records, you’ll need
          to authorize the release of their records to us. How you release their
          records depends on where the Veteran was receiving care at the time of
          their death.
        </p>
        <p>
          Provide details about the records or information you want us to
          request. This will help us request this information.
        </p>
        <p>
          <strong>
            If the Veteran was receiving care at a VA or federal health facility
            at the time of their death,
          </strong>{' '}
          you can submit a statement in support of your application (VA Form
          21-4138).
        </p>
        <p>
          <va-link
            href="/find-forms/about-form-21-4138/"
            text="Get VA Form 21-4138 to download"
            external
          />
        </p>
        <p>
          <strong>
            If the deceased Veteran was receiving care at a non-VA private
            health facility at the time of their death,
          </strong>{' '}
          we’ll try to locate their medical records for you.
        </p>
        <p>
          You can authorize the release of their medical records online after
          you submit this application.
        </p>
        <p>
          Or, you can fill out both of these forms and submit them with your
          online application or send them to us by mail:
        </p>
        <ul>
          <li>
            A completed Authorization to Disclose Information to the Department
            of Veterans Affairs (VA Form 21-4142)
            <br />
            <va-link
              href="/find-forms/about-form-21-4142/"
              text="Get VA Form 21-4142 to download"
              external
            />
          </li>
          <li>
            General Release for Medical Provider Information to the Department
            of Veterans Affairs (VA Form 21-4142a)
            <br />
            <va-link
              href="/find-forms/about-form-21-4142a/"
              text="Get VA Form 21-4142a to download"
              external
            />
          </li>
        </ul>
        <p>
          <strong>How to upload files</strong>
        </p>
        <ul>
          <li>Format the file as a .jpg, .pdf, or .png file</li>
          <li>Be sure that your file size is 20mb or less</li>
        </ul>
      </>
    ),
    additionalEvidence: {
      ...burialUploadUI({
        title: 'Upload additional supporting documents',
        required: false,
      }),
      'ui:validations': [validateFileUploads({ required: false })],
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalEvidence: fileInputMultipleSchema(),
    },
  },
};
