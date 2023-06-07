import React from 'react';

import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
// import SaveInProgressIntro from '../components/SaveInProgressIntro';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  // TODO: Uncomment componentDidMount after breadcrumbs are built
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Submit a lay witness statement to support a VA claim"
          subTitle="Lay/Witness Statement (VA Form 21-10210)"
        />
        <h2>Here’s how to apply online</h2>
        <p>
          Use this form to submit a formal statement to support your VA claim—or
          the claim of another Veteran or eligible family member. People also
          sometimes call this statement a “buddy statement.”
        </p>
        <p>
          A Veteran or a claimant may submit a lay/witness statement on their
          own behalf. Alternatively, a witness may submit on behalf of a Veteran
          or claimant.
        </p>
        <h2>What to know before you complete this form</h2>
        <ul>
          <li>
            You can submit a statement to support your own or someone else’s VA
            claim.
          </li>
          <li>
            To submit a statement to support someone else’s claim, you’ll need
            to give us information like their birth date, Social Security
            number, VA file number (if you have it), and contact information.{' '}
          </li>
          <li>
            Each statement needs its own form. If you want to submit more than
            one statement about your claim, use a new form for each statement.
            If you want more than one person to submit a statement to support
            your claim, ask each person to use a separate form.
          </li>
        </ul>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start your statement"
          unauthStartText="Sign in to start your statement"
          hideUnauthedStartLink={false}
          displayNonVeteranMessaging
        >
          <p>Please complete the 21-10210 form to apply for claims.</p>
        </SaveInProgressIntro>
        <p />

        <va-omb-info
          res-burden={10}
          omb-number="2900-0881"
          exp-date="06/30/2024"
        />
      </article>
    );
  }
}

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
