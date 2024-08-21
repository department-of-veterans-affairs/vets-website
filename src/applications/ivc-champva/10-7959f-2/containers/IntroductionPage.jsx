import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="File a Foreign Medical Program (FMP) claim"
        subTitle="FMP Claim Cover Sheet (VA Form 10-7959f-2)"
      />
      <p>
        If you’re a Veteran who gets medical care outside the U.S. for a
        service-connected condition, use this form to file a Foreign Medical
        Program (FMP) claim.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        What to know before you fill out this form
      </h2>
      <p>When you prepare to file, be sure to have these on hand: </p>
      <ul>
        <li>You’ll need an itemized billing statement to support your claim</li>
        <li>
          If you already paid the provider, you’ll need to upload a receipt or
          other proof that you paid
        </li>
        <li>
          For certain types of claims, you may need other supporting documents
        </li>
      </ul>
      <a
        href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/#supporting-documents-to-send-w"
        style={{ display: 'inline-block', marginBottom: '2em' }}
      >
        {' '}
        Find out which supporting documents you need.
      </a>
      <SaveInProgressIntro
        formId={formConfig.formId}
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        alertTitle="Sign in now to save time and save your work in progress"
        unauthStartText="Sign in to start your claim"
        formConfig={{
          customText: {
            appType: 'claim',
          },
        }}
      />
      <va-omb-info
        res-burden={11}
        omb-number="2900-0648"
        exp-date="03/31/2027"
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
