import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

// Components
import OmbInfo from '../components/OmbInfo';
import TechnologyProgramAccordion from '../components/TechnologyProgramAccordion';

const customLink = ({ children, ...props }) => {
  return (
    <va-link-action
      type="primary-entry"
      text="Start your request for reimbursement"
      {...props}
    >
      {children}
    </va-link-action>
  );
};

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>
          You’ll need to apply and be found eligible for the VA education
          benefit under which you want your reimbursement processed.
        </p>
        <p>
          <va-link
            text="Apply for VA education benefits using Form 22-1990"
            href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
          />
          , <strong>or</strong>
        </p>
        <p>
          <va-link
            text="Apply for VA education benefits as a dependent using Form 22-5490"
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction"
          />
          , <strong>or</strong>
        </p>
        <p>
          <va-link
            text="Apply to use transferred education benefits using Form 22-1990e"
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction"
          />
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p className="vads-u-font-size--sans-md vads-u-font-weight--bold">
          Here’s what you’ll need to apply:
        </p>
        <ul>
          <li>
            Your social security or VA file number and if applicable, your payee
            number
          </li>
          <li>Your current mailing address and contact information</li>
          <li>
            The name of the licensing or certification test and date test was
            taken
          </li>
          <li>
            The name and address of the organization issuing the license or
            certification
          </li>
          <li>
            Have your receipt that lists the prep course costs and a copy of
            your enrollment vertification ready. If you don’t already have them,
            gather them now.
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office">
        <p>
          This request does not submit automatically. After you complete and
          review your information, download your completed VA Form 22-10272.
          Then, upload the form, the proof of enrollment, including mandatory
          fees for the prep course manually through{' '}
          <va-link
            text="QuickSubmit"
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
          />{' '}
          portals to complete the submission process.
        </p>
        <p>
          If you would rather print and mail your form and attachments, the
          addresses for your region will be listed at the end of this form.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const { route } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />

      <p className="vads-u-font-size--lg vads-u-font-family--serif vads-u-color--base vads-u-font-weight--normal">
        VA Form 22-10272 is used to request reimbursement for prep courses that
        help you prepare for licensing or certification tests.
      </p>

      <h2 className="vad-u-margin-top--0">
        Follow these steps to get started:
      </h2>

      <ProcessList />

      <div className="vads-u-margin-bottom--4">
        <va-additional-info trigger="What happens after you apply">
          <p>
            After you successfully submit your form, we will review your
            documents. You should hear back within 30 days about your
            reimbursement.
          </p>
        </va-additional-info>
      </div>

      <SaveInProgressIntro
        hideUnauthedStartLink={!userLoggedIn}
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        formConfig={formConfig}
        pageList={pageList}
        unauthStartText="Sign in or create an account"
        customLink={userLoggedIn ? customLink : null}
      />
      <p />

      <div
        className={userLoggedIn ? 'vads-u-margin-top--4' : ''}
        data-testid="omb-info"
      >
        <OmbInfo />
      </div>
      <TechnologyProgramAccordion />
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
