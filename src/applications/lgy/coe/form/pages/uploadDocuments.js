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

const containsOneTimeRestoration = formData =>
  formData?.relevantPriorLoans?.some(
    loan =>
      loan?.entitlementRestoration ===
      entitlementRestorationOptions.ONE_TIME_RESTORATION,
  );

//const containsOneTimeRestoration = formData => true;

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

  containsOneTimeRestoration(formData) &&
    requiredDocumentTypes.push('Loan evidence');

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

const getAccordions = (formData, hasOneTimeRestoration) => {
  const showStatementOfService = [
    serviceStatuses.VETERAN,
    serviceStatuses.ADSM,
    serviceStatuses.NADNA,
  ].includes(formData?.identity);

  if (!showStatementOfService && !hasOneTimeRestoration) {
    return null;
  }

  return (
    <va-accordion data-testid="document-upload-accordion">
      {showStatementOfService && (
        <va-accordion-item open>
          <h3 slot="headline">Statement of service</h3>
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
      )}
      {hasOneTimeRestoration && (
        <va-accordion-item open>
          <h3 slot="headline">Type of evidence of a VA loan paid in full</h3>
          <p>
            Evidence can be in the form of a paid-in-full statement from the
            former lender, a satisfaction of mortgage from the clerk of court in
            the county where the home is located, or a copy of the HUD-1 or
            Closing Disclosure settlement statement completed in connection with
            a sale of the home or refinance of the prior loan. Many counties
            post public documents like the satisfaction of mortgage online.
          </p>
        </va-accordion-item>
      )}
    </va-accordion>
  );
};

const getRequiredDocumentMessage = (formData, hasOneTimeRestoration) => {
  const requiredDocumentMessages = {
    [serviceStatuses.VETERAN]: (

      <>
        {hasOneTimeRestoration ? (
          <>
            <p>You’ll need to upload these documents:</p>
            <ul>
              <li>A copy of your discharge or separation papers (DD214) showing character of service</li>
              <li>Evidence of a VA loan was paid in full (if applicable)</li>
            </ul>
          </>
        ) : (
          <p>
            You’ll need to upload a copy of your discharge or separation papers
            (DD214) showing character of service.
          </p>
        )}
      </>
    ),
    [serviceStatuses.ADSM]: (
      <>
        {formData?.militaryHistory?.purpleHeartRecipient || hasOneTimeRestoration ? (
          <>
            <p>You’ll need to upload these documents:</p>
            <ul>
              <li>Statement of Service</li>
              {formData?.militaryHistory?.purpleHeartRecipient && (
                <li>A copy of your Purple Heart certificate</li>
              )}
              {hasOneTimeRestoration && (
                <li>Evidence of a VA loan was paid in full (if applicable)</li>
              )}
            </ul>
          </>
        ) : (
          <p>You’ll need to upload a Statement of Service.</p>
        )}
      </>
    ),
    [serviceStatuses.NADNA]: (
      <>
        <p>You'll need to upload these documents:</p>
        <ul>
          <li>Statement of Service</li>
          <li>
            Creditable number of years served <strong>or</strong> Retirement
            Points Statement or equivalent
          </li>
          {hasOneTimeRestoration && (
            <li>Evidence of a VA loan was paid in full (if applicable)</li>
          )}
        </ul>
      </>
    ),
    [serviceStatuses.DNANA]: (
      <>
        <p>You'll need to upload these documents:</p>
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
          {hasOneTimeRestoration && (
            <li>Evidence of a VA loan was paid in full (if applicable)</li>
          )}
        </ul>
      </>
    ),
    [serviceStatuses.DRNA]: (
      <>
        <p>You'll need to upload these documents:</p>
        <ul>
          <li>Retirement Point Accounting</li>
          <li>
            Proof of honorable service for at least six years such as a DD214 or
            Department of Defense Discharge Certificate
          </li>
          {hasOneTimeRestoration && (
            <li>Evidence of a VA loan was paid in full (if applicable)</li>
          )}
        </ul>
      </>
    ),
  };

  return requiredDocumentMessages[formData.identity]
};

export const getUiSchema = () => ({
  ...titleUI('Upload your documents', ({ formData }) => {
    const hasOneTimeRestoration = containsOneTimeRestoration(formData);
    return (
      <>
        {getRequiredDocumentMessage(formData, hasOneTimeRestoration)}
        {getAccordions(formData, hasOneTimeRestoration)}
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
