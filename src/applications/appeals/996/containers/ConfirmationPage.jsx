import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import { Toggler } from 'platform/utilities/feature-toggles';

import ConfirmationPageV2 from '../components/ConfirmationPageV2';
import { formTitle } from '../content/title';
import ConfirmationDecisionReviews from '../../shared/components/ConfirmationDecisionReviews';

const alertContent = (
  <>
    <p className="vads-u-margin-top--0">
      If you requested an informal conference, we’ll contact you to schedule
      your conference.
    </p>
    <p className="vads-u-margin-bottom--0">
      After we’ve completed our review, we’ll mail you a decision packet with
      the details of our decision.
    </p>
  </>
);

export const ConfirmationPage = () => {
  resetStoredSubTask();

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrConfirmationUpdate}>
      <Toggler.Enabled>
        <ConfirmationPageV2 />
      </Toggler.Enabled>

      <Toggler.Disabled>
        <ConfirmationDecisionReviews
          appType="request"
          pageTitle={formTitle}
          alertTitle="We’ve received your request for a Higher-Level Review"
          alertContent={alertContent}
        >
          <h2 className="vads-u-font-size--h3">What to expect next</h2>
          <p>
            You don’t need to do anything unless we send you a letter asking for
            more information. If you requested an informal conference, we’ll
            contact you to schedule your conference.
          </p>
          <a href="/decision-reviews/after-you-request-review/">
            Learn more about what happens after you request a decision review
          </a>
          <p>You can also check the status of your request online.</p>
          <a href="/claim-or-appeal-status/">
            Check the status of your Higher-Level Review request online
          </a>
          <p>
            <strong>Note:</strong> It may take 7 to 10 days after you submit
            your request for it to appear online.
          </p>

          <h2 className="vads-u-font-size--h3">
            How to contact us if you have questions
          </h2>
          <p>You can ask us a question online through Ask VA.</p>
          <p>
            <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
          </p>
          <p>
            Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ).
          </p>
          <p>
            <strong>
              If you don’t hear back from us about your Higher-Level Review
              request,
            </strong>{' '}
            don’t request a Higher-Level Review again or another type of
            decision review. Contact us online or call us instead.
          </p>
        </ConfirmationDecisionReviews>
      </Toggler.Disabled>
    </Toggler>
  );
};

export default ConfirmationPage;
