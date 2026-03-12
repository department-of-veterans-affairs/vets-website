import React from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { showPdfFormAlignment } from '../../../utils/helpers';

/**
 * UI description content for the Supporting documents page.
 *
 * Renders conditional guidance based on the benefits selected and details
 * about the Veteran’s death and requested burial services.
 *
 * @param {Object} props - React component props.
 * @param {Object} props.formData - Current form data from the form system.
 * @returns {JSX.Element} Supporting documents description content.
 */
function Description(props) {
  const isClaimingBurialAllowance =
    props.formData['view:claimedBenefits'].burialAllowance;
  const serviceRequested =
    props.formData?.burialAllowanceRequested?.service === true;
  const locationIsVaMedicalCenter =
    props.formData?.locationOfDeath?.location === 'vaMedicalCenter';
  const isDeathCertificateRequired = !(
    isClaimingBurialAllowance &&
    serviceRequested &&
    locationIsVaMedicalCenter
  );
  const hasSelectedTransportationCosts =
    props.formData['view:claimedBenefits'].transportation;
  const pdfAligned = showPdfFormAlignment();

  let supportingDocumentsContent;
  if (isDeathCertificateRequired) {
    supportingDocumentsContent = (
      <>
        <p>You’ll need to upload these documents:</p>
        <ul>
          <li>The deceased Veteran’s death certificate</li>
          {hasSelectedTransportationCosts && (
            <li>An itemized receipt for transportation costs</li>
          )}
        </ul>
      </>
    );
  } else {
    supportingDocumentsContent = (
      <>
        <p>You can upload copies of these documents:</p>
        <ul>
          {hasSelectedTransportationCosts && (
            <li>An itemized receipt for transportation costs</li>
          )}
          <li>
            A copy of the Veteran’s death certificate including the cause of
            death
          </li>
        </ul>
      </>
    );
  }
  return (
    <>
      <p>
        Next we’ll ask you to submit supporting documents for your application.
        {!pdfAligned && (
          <>
            {' '}
            If you upload all of your supporting documents online now, you may
            be able to get a faster decision on your application.
          </>
        )}
      </p>

      <p>
        <strong>Note:</strong> If we receive your application and we need
        additional documents, we’ll ask you to submit them. If you don’t respond
        within 30 days of our request, we may decide your application with the
        information that’s available to us.
      </p>

      {supportingDocumentsContent}

      <h3>Medical records</h3>
      <p>
        If you’re applying for a burial allowance for a service-connected death,
        we recommend submitting the Veteran’s medical records. How you submit
        their records depends on if you have access to them right now.
      </p>

      <p>
        <strong>Note:</strong> It’s your choice whether you want to submit the
        Veteran’s medical records. They’ll help us process your application and
        confirm information about the Veteran’s medical history at the time of
        their death.
      </p>

      <h4>If you have access</h4>
      <p>
        If you have access to the Veteran’s medical records, you can submit
        copies of them with your online application or send them to us by mail.
      </p>

      <h4>If you don’t have access</h4>
      <p>
        If you don’t have access to the Veteran’s medical records, you’ll need
        to authorize the release of their records to us. How you release their
        records depends on where the Veteran was receiving care at the time of
        their death.
      </p>

      <p>
        Provide details about the records or information you want us to request.
        This will help us request this information.
      </p>

      <p>
        <strong>
          If the Veteran was receiving care at a VA or federal health facility
          at the time of their death,
        </strong>{' '}
        you can submit a statement in support of your application (VA Form
        21-4138).
      </p>
      <ul>
        <li>
          <va-link
            href="/find-forms/about-form-21-4138/"
            text="Get VA Form 21-4138 to download"
            external
          />
        </li>
      </ul>

      <p>
        <strong>
          If the Veteran was receiving care at a non-VA private health facility
          at the time of their death,
        </strong>{' '}
        we’ll try to locate their medical records for you.
      </p>

      <p>
        You can authorize the release of their medical records online after you
        submit this application.
      </p>

      <p>
        Or, you can fill out both of these forms and submit them with your
        online application or send them to us by mail:
      </p>
      <ul>
        <li>
          Authorization to Disclose Information to the Department of Veterans
          Affairs (VA Form 21-4142)
          <div>
            <va-link
              href="/find-forms/about-form-21-4142/"
              text="Get VA Form 21-4142 to download"
              external
            />
          </div>
        </li>
        <li>
          General Release for Medical Provider Information to the Department of
          Veterans Affairs (VA Form 21-4142a)
          <div>
            <va-link
              href="/find-forms/about-form-21-4142a/"
              text="Get VA Form 21-4142a to download"
              external
            />
          </div>
        </li>
      </ul>
    </>
  );
}

Description.propTypes = {
  formData: PropTypes.object.isRequired,
};

/**
 * Page configuration for the Supporting documents page.
 *
 * @type {{ uiSchema: Object, schema: Object }}
 */
export default {
  uiSchema: {
    ...titleUI('Supporting documents'),
    'ui:description': Description,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
