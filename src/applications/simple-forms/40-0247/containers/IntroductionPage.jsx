import React from 'react';
import PropTypes from 'prop-types';

import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const content = {
  formTitle: 'Request a Presidential Memorial Certificate',
  formSubTitle:
    'Presidential Memorial Certificate request form (VA Form 40-0247)',
  authStartFormText: 'Start your request',
  unauthStartText: 'Sign in to start your request',
  saveInProgressText:
    'Please complete the 40-0247 form to request a certificate.',
  displayNonVeteranMessaging: true,
  verifiedPrefillAlert: (
    <div>
      <div className="usa-alert usa-alert-info schemaform-sip-alert">
        <div className="usa-alert-body">
          <strong>Note:</strong> Since you’re signed in to your account, you can
          save your request in progress and come back later to finish filling it
          out.
        </div>
      </div>
      <br />
    </div>
  ),
};

const ombInfo = {
  resBurden: '3',
  ombNumber: '2900-0567',
  expDate: '09/30/2023',
};

const childContent = (
  <>
    <h2 className="vad-u-margin-top--0">
      Follow the steps below to get started
    </h2>
    <va-process-list>
      <li>
        <h3 className="vads-u-font-size--h4">Check for eligibility</h3>
        <p>
          Make sure our eligibility requirements are met before you submit a
          request
        </p>
        <p className="vads-u-font-weight--bold">Enlisted Service Members</p>
        <ul>
          <li>
            For those who served <strong>after</strong> September 7, 1980: A
            minimum of 24 months of consecutive active service is required.
          </li>
          <li>
            For those who served <strong>before</strong> September 7, 1980: At
            least 1 day of active service is required.
          </li>
        </ul>
        <p className="vads-u-font-weight--bold">Enlisted Officers</p>
        <ul>
          <li>
            For those who served <strong>after</strong> October 26, 1981: A
            minimum of 24 months of consecutive active service is necessary.
          </li>
          <li>
            For those who served <strong>before</strong> October 26, 1981: At
            least 1 day of active service is required.
          </li>
        </ul>
        <p>
          <strong>Note</strong>: Active duty for training purposes does not
          count towards the active duty service requirement.
        </p>
      </li>
      <li>
        <h3 className="vads-u-font-size--h4">Gather information</h3>
        <p>We’ll ask you for this optional information:</p>
        <ul>
          <li>
            <strong>Military discharge information</strong> To receive a
            Presidential Memorial Certificate, specific active duty service
            requirements must be met. It’s not required, but it is preferred
            since it will help speed up the request review process
          </li>
          <li>
            The preferred discharge document to establish eligibility for the
            certificate is Form DD214.
          </li>
        </ul>
      </li>
      <li>
        <h3 className="vads-u-font-size--h4">Start your request</h3>
        <p>
          We’ll take you through each step of the process. It should take about
          3 minutes.
        </p>
        <p>
          After you submit the form, you’ll get a confirmation message. You can
          print this page for your records.
        </p>
        <va-additional-info trigger="What happens after I submit the request?">
          <div>
            After we receive your request, we’ll verify eligibility. If
            eligibility is determined, the requested certificates will be mailed
            to you.
          </div>
        </va-additional-info>
      </li>
    </va-process-list>
  </>
);

export const IntroductionPage = ({ route }) => {
  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
    />
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
};

export default IntroductionPage;
