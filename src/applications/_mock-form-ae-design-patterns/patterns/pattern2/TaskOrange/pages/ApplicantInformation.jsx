import React from 'react';
import { format, parseISO } from 'date-fns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { InfoSection } from '../../../../shared/components/InfoSection';
import { maskSSN } from '../../../../utils/helpers/general';
import { genderLabels } from '../utils/labels';
import { isOnReviewPage } from '../utils/reviewPage';

const AdditionalInfoContent = () => {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        To protect your personal information, we don’t allow online changes to
        your name, date of birth, or Social Security number. If you need to
        change this information, call Veterans Benefits Assistance at{' '}
        <va-telephone contact="8008271000" />. We’re here Monday through Friday,
        between 8:00 a.m. and 9:00 p.m. ET.
      </p>

      <va-link
        text="Find instructions for how to change your legal name"
        href="/resources/how-to-change-your-legal-name-on-file-with-va/"
      />
    </div>
  );
};

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
      {isReviewPage && (
        <va-additional-info
          trigger="Why isn't this information editable here?"
          class="vads-u-margin-y--2"
        >
          <AdditionalInfoContent />
        </va-additional-info>
      )}
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

      <va-additional-info
        trigger="How to change this information"
        class="vads-u-margin-bottom--5"
      >
        <AdditionalInfoContent />
      </va-additional-info>

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
