import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { connect, useSelector } from 'react-redux';
import {
  isLoggedIn,
  selectProfile,
  isProfileLoading,
} from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

// Components
import OmbInfo from '../components/OmbInfo';
import TechnologyProgramAccordion from '../components/TechnologyProgramAccordion';

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
        Use this form if you want to give VA permission to release your personal
        information regarding your current or future education benefits to a
        third party.
      </p>

      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2 mobile-lg:vads-u-margin-y--4">
        What to know before you fill out this form
      </h2>
      <ul data-testid="what-to-know-list">
        <li>
          If you want to keep some information from your records private, you
          can use this form to authorize us to release only specific
          information.
        </li>
        <li>
          This form doesn’t give the third-party individual or organization
          permission to manage or change the information in your VA record. They
          can only access the information.
        </li>
        <li>
          You can change your mind and tell us to stop releasing your
          information at any time. We can’t take back any information we may
          have already released based on your authorization.
        </li>
      </ul>
      <div className="vads-u-margin-y--4">
        {!userLoggedIn ? (
          <SaveInProgressIntro
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            formConfig={route.formConfig}
            pageList={pageList}
            startText="Start your Authorization to disclose personal information"
            unauthStartText="Sign in or create an account"
          />
        ) : (
          <>
            <va-alert status="info" visible class="vads-u-margin-y--4">
              <h3 slot="headline">We've prefilled some of your information</h3>
              Since you're signed in, we can prefill part of your application
              based on your profile details. You can also save your application
              in progress and come back later to finish filling it out.
            </va-alert>
            <SaveInProgressIntro
              headingLevel={2}
              prefillEnabled={formConfig.prefillEnabled}
              formConfig={route.formConfig}
              pageList={pageList}
              startText="Start your Authorization to disclose personal information"
              buttonOnly
            />
          </>
        )}
      </div>

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

function mapStateToProps(state) {
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
    showLoadingIndicator: isProfileLoading(state),
  };
}

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
  toggleLoginModal: PropTypes.func,
};

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(IntroductionPage);
