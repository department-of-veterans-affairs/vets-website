import React from 'react';
import { format, parseISO } from 'date-fns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { withRouter } from 'react-router';
import { InfoSection } from '../../../../shared/components/InfoSection';
import { maskSSN } from '../../../../utils/helpers/general';
import { APP_URLS } from '../../../../utils/constants';
import { genderLabels } from '../utils/labels';
import { isOnReviewPage } from '../utils/reviewPage';

export const ApplicantInformationBase = ({
  veteranFullName,
  veteranSocialSecurityNumber,
  veteranDateOfBirth,
  gender,
  ...rest
}) => {
  const isReviewPage = isOnReviewPage(rest?.location?.pathname);
  const title = isReviewPage ? null : 'Applicant information';
  const formattedDob =
    veteranDateOfBirth && format(parseISO(veteranDateOfBirth), 'MMMM dd, yyyy');
  return (
    <InfoSection title={title} titleLevel={3}>
      <InfoSection.InfoBlock
        label="First name"
        value={veteranFullName?.first}
      />
      <InfoSection.InfoBlock
        label="Middle name"
        value={veteranFullName?.middle}
      />
      <InfoSection.InfoBlock label="Last name" value={veteranFullName?.last} />
      <InfoSection.InfoBlock label="Suffix" value={veteranFullName?.suffix} />
      <InfoSection.InfoBlock
        label="Social Security number"
        value={maskSSN(veteranSocialSecurityNumber)}
      />
      <InfoSection.InfoBlock label="Date of birth" value={formattedDob} />
      <InfoSection.InfoBlock label="Gender" value={genderLabels?.[gender]} />
    </InfoSection>
  );
};

export const ApplicantInformationInfoSection = withRouter(
  ApplicantInformationBase,
);

export const ApplicantInformation = ({
  data,
  goBack,
  goForward,
  contentAfterButtons,
  contentBeforeButtons,
}) => {
  const {
    veteranFullName,
    veteranSocialSecurityNumber,
    gender,
    veteranDateOfBirth,
  } = data;

  return (
    <>
      <p>Confirm your information before you continue.</p>

      <ApplicantInformationInfoSection
        veteranDateOfBirth={veteranDateOfBirth}
        veteranFullName={veteranFullName}
        veteranSocialSecurityNumber={veteranSocialSecurityNumber}
        gender={gender}
      />

      <p>
        Note: To protect your personal information, we don’t allow online
        changes to your name, date of birth, or Social Security number. If you
        need to change this information for your health benefits, call your VA
        health facility.{' '}
        <va-link
          href={APP_URLS.facilities}
          text="Find your VA health facility"
        />
      </p>
      <div className="vads-u-margin-bottom--3">
        <va-link href="/profile" text="Go to your profile" external />
      </div>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};
