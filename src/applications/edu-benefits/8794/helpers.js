import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import { readOnlyCertifyingOfficialIntro } from './pages/readOnlyCertifyingOfficialIntro';
import { additionalOfficialIntro } from './pages/additionalOfficialIntro';

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
          {item.additionalOfficialDetails?.phoneType === 'us'
            ? item.additionalOfficialDetails?.phoneNumber
            : item.additionalOfficialDetails?.internationalPhoneNumber}
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
