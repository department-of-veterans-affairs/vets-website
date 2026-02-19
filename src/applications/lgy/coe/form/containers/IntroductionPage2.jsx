import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { scrollToTop } from 'platform/utilities/scroll';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-bottom--0">
          Make sure you meet our eligibility requirements before you request a
          COE.
        </p>
        <va-link
          href="/housing-assistance/home-loans/eligibility/"
          text="Find out if you’re eligible for VA home loan programs"
        />
        <p>
          If you’ve already submitted a COE, don’t request a new one unless one
          of these cases applies to you:
        </p>
        <ul>
          <li>Our VA home loan case management team recommends it</li>
          <li>You need to fix an error on your COE</li>
          <li>You need to update the information on your COE</li>
          <li>You need to request a restoration of entitlement</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>Here’s what you’ll need to request a COE:</p>
        <ul>
          <li>
            Your personal information, including Social Security number, date of
            birth, mailing address, and contact information.
          </li>
          <li>
            The property location and dates of past VA loans (if you have or had
            a VA-backed loan).
          </li>
          <li>
            Based on your service, you’ll need to submit specific documents with
            your COE request.
            <div>
              <va-link
                href="/housing-assistance/home-loans/how-to-request-coe/"
                text="Review which documents you’ll need"
              />
            </div>
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Start your request">
        <p>
          We’ll take you through each step of the process. It should take about
          15 minutes.
        </p>
        <p>
          When you submit your COE request, you’ll get a confirmation message.
          You can print this message for your records.
        </p>
        <va-additional-info trigger="What happens after you submit your request">
          <div>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--2p5">
              After submitting your request, you’ll get a confirmation message.
              It’ll include details about your next steps. We may contact you if
              we have questions or need more information.
            </p>
            <p className="vads-u-margin-top--2p5 vads-u-margin-bottom--0p5">
              We process requests in the order we receive them. If you qualify
              for a COE, we’ll notify you by email about how you can get your
              COE document.
            </p>
          </div>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage2 = ({ route }) => {
  const userLoggedIn = useSelector(isLoggedIn);
  const userIdVerified = useSelector(isLOA3);
  const showVerifyIdentity = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Request a VA home loan Certificate of Eligibility (COE)"
        subTitle="Request for a Certificate of Eligibility (VA Form 26-1880)"
      />
      <p>
        Use VA Form 26-1880 to apply for a VA home loan COE. You’ll need to
        bring the COE to your lender to prove that you qualify for a VA home
        loan.
      </p>
      <h2 className="vads-u-margin-top--0">
        Follow these steps to request a new COE
      </h2>
      <ProcessList />
      {showVerifyIdentity ? (
        <VerifyAlert headingLevel={3} dataTestId="coe-26-1880-identity-alert" />
      ) : (
        <SaveInProgressIntro
          formConfig={route.formConfig}
          headingLevel={2}
          hideUnauthedStartLink
          messages={route.formConfig.savedFormMessages}
          pageList={route.pageList}
          prefillEnabled={route.formConfig.prefillEnabled}
          startText="Request a Certificate of Eligibility"
        />
      )}
      <p />
      <va-omb-info
        exp-date="10/31/2025"
        omb-number="2900-0086"
        res-burden={15}
      />
    </article>
  );
};

IntroductionPage2.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage2;
