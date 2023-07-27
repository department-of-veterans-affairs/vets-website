import React from 'react';

import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route, user } = this.props;
    const userLoggedIn = user.login.currentlyLoggedIn;
    const { formConfig, pageList } = route;
    const claimNotTriggeredDisclaimerContent = (
      <>
        <p>
          <strong>Note</strong>: this form does not trigger a claim, it only
          informs the VA of your intent to file a claim. The Veteran or Claimant
          would need to complete one of the following forms within one year from
          the date of filing 21-0966 to receive benefits.
        </p>
        <ul>
          <li>
            <a href="/disability/file-disability-claim-form-21-526ez/introduction">
              21-526EZ (Disability compensation)
            </a>
          </li>
          <li>
            <a href="/pension/application/527EZ/introduction">
              21P-527EZ (Pension Claim)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-534ez/">
              21P-534EZ (Survivors Related Pension)
            </a>
          </li>
        </ul>
        <p>
          The 21-0966 form establishes the start date of compensation of
          benefits if the Veteran or Claimant is awarded compensation based on
          one of applications above.
        </p>
      </>
    );

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Notify the VA of your intent to file a claim"
          subtitle="Intent to file a claim for compensation and/or pension, or survivors pension and/or DIC (VA Form 21-0966)"
        />
        {!userLoggedIn ? (
          <>
            <h2>What to know before you fill out this form</h2>
            <p>
              Use VA Form 21-0966 if you’re still gathering information to
              support your disability or pension claims and want to start the
              filing process. Submitting an intent to file can secure the
              earliest possible effective date for any retroactive payments you
              may be eligible to receive.
            </p>
            <p>
              If you are a non-Veteran claimant intending to file for Survivors
              Related Pension (VA Form 21P-534EZ) or if you are filing on behalf
              of someone else, you’ll want to download and submit the{' '}
              <a href="http://www.vba.va.gov/pubs/forms/VBA-21-0966-ARE.pdf">
                Intent to File (VA Form 21-0966) PDF
              </a>
              .
            </p>
            {claimNotTriggeredDisclaimerContent}
          </>
        ) : (
          <>
            <h2>When to use this form</h2>
            <p>
              Use VA Form 21-0966 if you’re still gathering information to
              support your disability or pension claims and want to start the
              filing process. Submitting an intent to file can secure the
              earliest possible effective date for any retroactive payments you
              may be eligible to receive.
            </p>
            <p>
              If you are a non-Veteran claimant intending to file for Survivors
              Related Pension (VA Form 21P-534EZ) or if you are filing on behalf
              of someone else, you’ll want to download and submit the{' '}
              <a href="http://www.vba.va.gov/pubs/forms/VBA-21-0966-ARE.pdf">
                Intent to File (VA Form 21-0966) PDF
              </a>
              .
            </p>
          </>
        )}
        <SaveInProgressIntro
          headingLevel={2}
          alertTitle="Sign in now to save time and save your work in progress"
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start your intent to file"
          hideUnauthedStartLink
        >
          Please complete the 21-0966 form to send your intent to file.
        </SaveInProgressIntro>

        {userLoggedIn && claimNotTriggeredDisclaimerContent}

        <va-omb-info
          res-burden="5"
          omb-number="2900-0826"
          exp-date="02/28/2026"
        />
      </article>
    );
  }
}

// Need state-slice for dynamic content outside of <SaveInProgressIntro/>
function mapStateToProps(state) {
  return {
    ...getIntroState(state),
  };
}

export default connect(mapStateToProps)(IntroductionPage);
