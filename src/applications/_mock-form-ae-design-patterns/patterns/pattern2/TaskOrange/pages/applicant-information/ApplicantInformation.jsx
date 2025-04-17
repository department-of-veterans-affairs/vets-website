import React, { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import {
  focusElement,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { maskSSN } from 'applications/_mock-form-ae-design-patterns/utils/helpers/general';
import { InfoSection } from 'applications/_mock-form-ae-design-patterns/shared/components/InfoSection';
import { genderLabels } from '../../utils/labels';
import { isOnReviewPage } from '../../utils/reviewPage';

const AdditionalInfoContent = () => {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        To protect your personal information, we don’t allow online changes to
        your name, Social Security number, date of birth, or gender. If you need
        to change this information, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />) . We’re here Monday through Friday,
        between 8:00 a.m. and 9:00 p.m. ET. We’ll give you instructions for how
        to change your information.
      </p>

      <p className="vads-u-margin-bottom--0">
        Or you can learn how to change your legal name on file with VA.{' '}
        <va-link
          external
          text="Learn how to change your legal name (opens in new tab)"
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
        />
      </p>
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
  const ssn = maskSSN(veteranSocialSecurityNumber);

  return (
    <InfoSection title={title} titleLevel={3}>
      {isReviewPage && (
        <va-additional-info
          trigger="How to change this information"
          class="vads-u-margin-y--2"
        >
          <AdditionalInfoContent />
        </va-additional-info>
      )}
      <dl>
        <InfoSection.InfoBlock
          label="First name"
          value={veteranFullName?.first}
        />
        <InfoSection.InfoBlock
          label="Middle name"
          value={veteranFullName?.middle}
        />
        <InfoSection.InfoBlock
          label="Last name"
          value={veteranFullName?.last}
        />
        <InfoSection.InfoBlock label="Suffix" value={veteranFullName?.suffix} />
        <InfoSection.InfoBlock label="Social Security number" value={ssn} />
        <InfoSection.InfoBlock label="Date of birth" value={formattedDob} />
        <InfoSection.InfoBlock label="Gender" value={genderLabels?.[gender]} />
      </dl>
    </InfoSection>
  );
};

ApplicantInformationBase.propTypes = {
  gender: PropTypes.string,
  location: PropTypes.object,
  veteranDateOfBirth: PropTypes.string,
  veteranFullName: PropTypes.object,
  veteranSocialSecurityNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
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

  const progressBar = document.getElementById('nav-form-header');

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollTo('topScrollElement');
      if (progressBar) {
        progressBar.style.display = 'block';
        focusElement(progressBar);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [progressBar]);

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
