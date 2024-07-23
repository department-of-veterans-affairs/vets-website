import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
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
      <FormTitle
        title="Register for the Foreign Medical Program (FMP)"
        subTitle="FMP Registration Form (VA Form 10-7959f-1)"
      />
      <p>
        If you’re a Veteran who gets medical care outside the U.S. for a
        service-connected condition, we may cover the cost of your care. Use
        this form to register for the Foreign Medical Program.
      </p>
      <h3>What to know before you fill out this form</h3>
      <div className="process schemaform-process">
        <ul>
          <li>
            You’ll need your Social Security number or your VA file number.
          </li>
          <li>
            After you register, we’ll send you a benefits authorization letter.
            This letter will list your service-connected conditions that we’ll
            cover. Then you can file FMP claims for care related to the covered
            conditions.
          </li>
        </ul>
      </div>
      <SaveInProgressIntro
        formId={formConfig.formId}
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        alertTitle="Sign in now to save time and save your work in progress"
        unauthStartText="Sign in to start your form"
        formConfig={{
          customText: {
            appType: 'registration form',
          },
        }}
      />

      <va-omb-info
        res-burden={4}
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
