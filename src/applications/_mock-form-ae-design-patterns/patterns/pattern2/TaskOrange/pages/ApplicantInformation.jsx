import React from 'react';
import { format, parseISO } from 'date-fns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
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
  location,
}) => {
  const isReviewPage = isOnReviewPage(location?.pathname);
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

ApplicantInformationBase.propTypes = {
  gender: PropTypes.string,
  location: PropTypes.object,
  veteranDateOfBirth: PropTypes.string,
  veteranFullName: PropTypes.object,
  veteranSocialSecurityNumber: PropTypes.string,
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
      <p className="vads-u-font-size--md">
        Confirm your information before you continue.
      </p>

      <ApplicantInformationInfoSection
        veteranDateOfBirth={veteranDateOfBirth}
        veteranFullName={veteranFullName}
        veteranSocialSecurityNumber={veteranSocialSecurityNumber}
        gender={gender}
      />

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information for your health benefits,
        call your VA health facility.{' '}
        <va-link
          href={APP_URLS.facilities}
          text="Find your VA health facility"
        />
      </p>
      <p>
        If you want to update your contact information for other VA benefits,
        you can do that from your profile.{' '}
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

ApplicantInformation.propTypes = {
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};
