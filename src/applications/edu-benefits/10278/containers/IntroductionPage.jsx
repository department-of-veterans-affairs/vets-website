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
            formConfig={formConfig}
            pageList={pageList}
            startText="Start your Authorization to disclose personal information"
            unauthStartText="Sign in or create an account"
          />
        ) : (
          <SaveInProgressIntro
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            formConfig={formConfig}
            pageList={pageList}
            startText="Start your Authorization to disclose personal information"
          />
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

export default IntroductionPage;
