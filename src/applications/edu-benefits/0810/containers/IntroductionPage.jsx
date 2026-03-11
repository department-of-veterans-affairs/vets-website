import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

import ProcessList from '../components/IntroProcessList';
import PrivacyAccordion from '../components/PrivacyAccordion';
import OMBInfo from '../components/OMBInfo';

const customLink = ({ children, ...props }) => {
  return (
    <va-link-action
      type="primary-entry"
      text="Start your Request reimbursement for national exam fees"
      {...props}
    >
      {children}
    </va-link-action>
  );
};

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
        Use this form to request reimbursement for national exam fees and use
        your VA education benefits.
      </p>
      <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <ProcessList />
      <va-additional-info
        trigger="What happens after you submit your form"
        class="vads-u-margin-bottom--3"
      >
        <p>
          After you successfully submit your form, we will review your
          documents. You should hear back within 30 days about your
          reimbursement.
        </p>
      </va-additional-info>

      <SaveInProgressIntro
        hideUnauthedStartLink={!userLoggedIn}
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        formConfig={formConfig}
        pageList={pageList}
        unauthStartText="Sign in or create an account"
        customLink={userLoggedIn ? customLink : null}
      />
      <p />

      <div
        className={userLoggedIn ? 'vads-u-margin-top--4' : ''}
        data-testid="omb-info"
      >
        <OMBInfo />
      </div>
      <PrivacyAccordion />
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
  loggedIn: PropTypes.bool,
};
function mapStateToProps(state) {
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
  };
}

export default connect(mapStateToProps)(IntroductionPage);
