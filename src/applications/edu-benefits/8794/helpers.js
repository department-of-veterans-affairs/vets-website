import React from 'react';

export const getCardDescription = item => {
  return item ? (
    <>
      {/* <p className="vads-u-margin-top--0" data-testid="card-title">
        {item.additionalOfficialDetails?.title || 'Title'}
      </p>
      <p data-testid="card-file-number">{item.fileNumber || 'File number'}</p>
      {item.enrollmentPeriod?.from && (
        <p data-testid="card-enrollment-period">
          {formatReviewDate(item.enrollmentPeriod.from)}
          {item.enrollmentPeriod?.to &&
            ` - ${formatReviewDate(item.enrollmentPeriod.to)}`}
        </p> */}
      {/* )} */}
      <p>hello meeee</p>
    </>
  ) : null;
};

export const getCardTitle = item => {
  let title = null;

  if (item) {
    // const first = item.additionalOfficialDetails?.title || 'Certifying';
    // const last = item.certifyingOfficial?.last || 'Official';
    title = `${title}`;
  }

  return title;
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
    // summaryTitle:
    //   'Review the individuals with a potential conflict of interest that receive VA educational benefits',
    summaryTitle: props =>
      `Review your ${
        props?.formData['additional-certifying-official'].length > 1
          ? 'additional certifying officials'
          : 'additional certifying official'
      }`,
  },
};

// export const additionalOfficialArrayOptions = {
//   arrayPath: 'additionalOfficialDetails',
//   nounSingular: 'official',
//   nounPlural: 'officials',
//   required: true,
//   text: {
//     getItemName: item => item?.fullName,
//     cardDescription: item => {
//       return item?.fullName;
//     },
//     summaryTitle: props =>
//       `Review your ${
//         props?.formData?.additionalOfficialDetails.length > 1
//           ? 'additional certifying officials'
//           : 'additional certifying official'
//       }`,
//   },
// };

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
