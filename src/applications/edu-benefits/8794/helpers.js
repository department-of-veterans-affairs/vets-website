import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import { readOnlyCertifyingOfficialIntro } from './pages/readOnlyCertifyingOfficialIntro';
import { additionalOfficialIntro } from './pages/additionalOfficialIntro';

export const getTransformIntlPhoneNumber = (phone = {}) => {
  let _contact = '';
  const { callingCode, contact, countryCode } = phone || {};

  if (contact) {
    const _callingCode = callingCode ? `+${callingCode} ` : '';
    const _countryCode = countryCode ? ` (${countryCode})` : '';
    _contact = `${_callingCode}${contact}${_countryCode}`;
  }

  return _contact;
};

export const getCardDescription = item => {
  return item ? (
    <>
      <p>
        <va-icon
          icon="phone"
          size={2}
          style={{
            position: 'relative',
            top: '-5px',
            left: '-1px',
            marginRight: '5px',
          }}
        />
        <span data-testid="card-phone-number">
          {getTransformIntlPhoneNumber(
            item.additionalOfficialDetails?.phoneNumber,
          )}
        </span>
      </p>
      <p>
        <va-icon
          icon="mail"
          size={2}
          style={{
            position: 'relative',
            top: '-5px',
            left: '-1px',
            marginRight: '5px',
          }}
        />
        <span data-testid="card-email">
          {item.additionalOfficialDetails?.emailAddress}
        </span>
      </p>
      <p data-testid="card-training-date">
        <strong>Section 305 Training Date: </strong>
        {item.additionalOfficialTraining?.trainingCompletionDate
          ? formatReviewDate(
              item.additionalOfficialTraining?.trainingCompletionDate,
            )
          : 'Exempt'}
      </p>
      <p data-testid="card-has-va-benefits">
        <strong>In receipt of VA Education benefits: </strong>
        {item.additionalOfficialBenefitStatus?.hasVaEducationBenefits
          ? 'Yes'
          : 'No'}
      </p>
    </>
  ) : null;
};

export const capitalizeFirstLetter = str => {
  if (!str || typeof str !== 'string') return '';
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const getCardTitle = item => {
  let cardTitle = null;

  if (item) {
    const first =
      item.additionalOfficialDetails?.fullName?.first || 'Certifying';
    const middle = item.additionalOfficialDetails?.fullName?.middle || '';
    const last = item.additionalOfficialDetails?.fullName?.last || 'Official';
    const title = item.additionalOfficialDetails?.title || 'Title';

    cardTitle = middle
      ? `${first} ${middle} ${last}, ${title}`
      : `${first} ${last}, ${title}`;
  }

  return cardTitle;
};

export const additionalOfficialArrayOptions = {
  arrayPath: 'additional-certifying-official',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
  text: {
    getItemName: item => getCardTitle(item),
    cardDescription: item => getCardDescription(item),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle: props => {
      return `Review your additional certifying ${
        props?.formData['additional-certifying-official']?.length > 1
          ? 'officials'
          : 'official'
      }`;
    },
    summaryDescriptionWithoutItems: props => {
      const count =
        props.formData['additional-certifying-official']?.length ?? 0;
      return count > 0 ? null : additionalOfficialIntro;
    },
  },
};
export const certifyingOfficialInfoAlert = (
  <va-alert status="info" visible>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
      <strong>Note:</strong> All certifying officials at your institution must
      be listed on this form. This submission will replace any previously
      provided list of certifying officials.{' '}
      <strong>
        If any information in this form changes, you must submit a new, updated
        form.
      </strong>
    </p>
  </va-alert>
);

export const certifyingOfficialTrainingInfo = (
  <>
    <p className="vads-u-margin-top--4">
      <strong>New School Certifying Officials:</strong> All newly designated
      certifying officials must complete required online training for new
      certifying officials based on their type of facility and provide a copy of
      their training certificate when submitting this form. Enter the date the
      new certifying official training was completed.
    </p>
    <p className="vads-u-margin-top--2">
      <strong>Existing School Certifying Officials:</strong> Existing SCOs at
      covered educational institutions must complete a certain number of
      training modules/training events based on their facility or program type,
      annually, to maintain their access to certifying enrollments to VA.
      <va-link
        href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/online_sco_training.asp#existing"
        text="Go to this page to find out what's required"
        external
      />
    </p>
  </>
);

export const getReadOnlyPrimaryOfficialTitle = item => {
  if (!item) return null;

  const first = (item.fullName?.first || '').trim() || 'Certifying';
  const middle = (item.fullName?.middle || '').trim();
  const last = (item.fullName?.last || '').trim() || 'Official';

  return [first, middle, last].filter(Boolean).join(' ');
};
export const readOnlyCertifyingOfficialArrayOptions = {
  arrayPath: 'readOnlyCertifyingOfficials',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
  text: {
    getItemName: item => getReadOnlyPrimaryOfficialTitle(item),
    summaryTitleWithoutItems: 'Add read-only certifying officials',
    summaryTitle: props => {
      return `Review your read-only certifying ${
        props?.formData?.readOnlyCertifyingOfficials?.length > 1
          ? 'officials'
          : 'official'
      }`;
    },
    summaryDescriptionWithoutItems: props => {
      const count = props.formData?.readOnlyCertifyingOfficials?.length ?? 0;
      return count > 0 ? null : readOnlyCertifyingOfficialIntro;
    },
  },
};

export const childContent = (pdfUrl, trackingPrefix, goBack) => (
  <div data-testid="download-link">
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
    <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
      To submit your form, follow the steps below
    </h2>
    <va-process-list uswds>
      <va-process-list-item header="Download and save your form">
        <div
          itemProp="itemListElement"
          className="confirmation-save-pdf-download-section"
        >
          <div>
            To submit this form, make sure that your completed form is saved as
            a PDF on your device.{' '}
            <p className="vads-u-margin-top--0">
              <va-link
                download
                filetype="PDF"
                href={pdfUrl}
                onClick={() =>
                  recordEvent({
                    event: `${trackingPrefix}confirmation-pdf-download`,
                  })
                }
                text="Download VA Form 22-8794"
              />
            </p>
          </div>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload your PDF to the Education File Upload Portal or email it to your State Approving Agency (SAA)">
        <div itemProp="itemListElement">
          <p className="vads-u-margin-top--1p5">
            <strong>If your institution has a VA facility code:</strong> Visit
            the{' '}
            <va-link
              external
              text="Education File Upload Portal"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />
            , and upload your saved VA Form 22-8794.
          </p>
          <p>
            <strong>
              If your institution doesn’t have a VA facility code:
            </strong>{' '}
            Email your downloaded PDF to your State Approving Agency (SAA). If
            you need help finding their email address,{' '}
            <va-link
              external
              text="search the SAA contact directory"
              href="https://nasaa-vetseducation.com/nasaa-contacts/"
            />
            .
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Next steps">
        <div itemProp="itemListElement">
          <p className="vads-u-margin-top--1">
            We will generally review your submission within 7-10 business days.
          </p>
          <p>
            <strong>
              If you uploaded your form to the Education File Upload Portal:
            </strong>{' '}
            Once we complete the review, we will email all certifying officials
            listed on this form to confirm that your institution’s information
            has been updated, and include a copy of the WEAMS 1998 report. If
            for any reason we cannot accept your form, we will explain the
            reasons why and give you instructions for re-submission.
          </p>
          <p>
            <strong>If you emailed the form to your SAA:</strong> After
            reviewing your form, the SAA will include it in the approval request
            they submit to the VA. They will reach out if they need more
            information. The VA will contact you directly once the approval
            request has been processed.
          </p>
        </div>
      </va-process-list-item>
    </va-process-list>
    <p>
      <va-button
        className="custom-classname"
        secondary
        text="Print this page"
        data-testid="print-page"
        onClick={() => window.print()}
      />
    </p>
    <p>
      <va-link
        onClick={goBack}
        class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
    </p>
  </div>
);

export const dateSigned = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const transformPhoneNumber = phoneNumber => {
  return phoneNumber.replaceAll('-', '');
};
