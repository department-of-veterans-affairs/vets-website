import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />

      <p>
        Use this form if you’re applying for Civilian Health and Medical Program
        of the Department of Veterans Affairs (CHAMPVA) benefits and have other
        non-VA health insurance. You can also use this form to report changes in
        your non-VA health insurance or your personal information, like your
        address or phone number.
      </p>

      <h2>What to know before you fill out this form</h2>

      <p>
        If you’re applying for CHAMPVA benefits for the first time, here’s what
        you’ll need to provide:
      </p>
      <ul>
        <li>
          <b>Personal information.</b> This includes your phone number and
          address.
        </li>
        <li>
          <b>Insurance information.</b> This includes any non-VA health
          insurance companies that cover you. And you may need to upload
          supporting documents, like copies of your Medicare cards, other health
          insurance cards, schedule of benefits and co-payment documents. Be
          sure to include any secondary or supplemental insurance such as
          vision, dental or accidental insurance.
        </li>
      </ul>

      <p>
        <b>If you’re already receiving CHAMPVA benefits,</b> you can provide
        updated personal information, like your phone number and address.
        <br />
        <br />
        And you can also provide your updated non-VA health insurance
        information and copies of your Medicare or other health insurance cards.
      </p>
      <SaveInProgressIntro
        formId={formConfig.formId}
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        unauthStartText="Sign in to start your form"
        formConfig={{
          customText: {
            appType: 'form',
            continueAppButtonText: 'Continue your form',
            startNewAppButtonText: 'Start a new form',
          },
        }}
      />
      <va-omb-info
        res-burden={10}
        omb-number="2900-0219"
        exp-date="10/31/2024"
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  route: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(IntroductionPage);
