import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import { TITLE } from '../constants';

const OMB_RES_BURDEN = 10;
const OMB_NUMBER = '2900-0009';
const OMB_EXP_DATE = '08/31/2025';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-bottom--0">
          Make sure you meet our eligibility requirements before you apply.
        </p>
        <va-link
          href="/careers-employment/vocational-rehabilitation/eligibility/"
          text="Find out if you’re eligible for VR&E benefits"
        />
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>Here’s what you’ll need to apply:</p>
        <ul>
          <li>Your Social Security number or VA file number</li>
          <li>
            An address, phone number, and email address where we can contact you
          </li>
        </ul>
        <p>
          <span className="vads-u-font-weight--bold">
            What if I need help filling out my application?
          </span>{' '}
          An accredited representative with a Veterans Service Organization
          (VSO) can help you fill out your application.{' '}
          <va-link
            href="/get-help-from-accredited-representative/"
            text="Get help filing your claim"
          />
        </p>
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. It should take about
          10 minutes.
        </p>
        <p>
          When you submit your application, you’ll get a confirmation message.
          You can print this message for your records.
        </p>
        <va-additional-info trigger="What happens after you apply?">
          <div>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--2p5">
              We’ll review your application to determine if you’re eligible for
              an initial evaluation with a Vocational Rehabilitation Counselor
              (VRC). If we determine you’re eligible for an initial evaluation,
              we’ll send you an appointment letter with the date and time when a
              VRC will meet with you.
            </p>
            <p className="vads-u-margin-top--2p5 vads-u-margin-bottom--0p5">
              During the initial evaluation, the VRC will gather information to
              determine if you’re entitled to receive VR&E benefits.
            </p>
          </div>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(isLoggedIn);
  const userIdVerified = useSelector(isLOA3);
  const isLoa1LoggedIn = userLoggedIn && !userIdVerified;
  const { route } = props;
  const { formConfig, pageList } = route;
  const fullSubTitle =
    'Application for Veteran Readiness and Employment for Claimants with Service-Connected Disabilities (VA Form 28-1900)';

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={fullSubTitle} />
      <p>
        Veteran Readiness and Employment (VR&E) benefits&mdash;also called
        Chapter 31&mdash;provide employment support and training services to
        help you find and keep a job, and live as independently as possible.
        Apply online now.
      </p>
      <h2 className="vads-u-margin-top--0">
        Follow these steps to get started
      </h2>
      <ProcessList />
      {isLoa1LoggedIn ? (
        <VerifyAlert headingLevel={3} dataTestId="vre-28-1900-identity-alert" />
      ) : (
        <SaveInProgressIntro
          formConfig={formConfig}
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Apply for veteran readiness and employment"
          hideUnauthedStartLink
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
