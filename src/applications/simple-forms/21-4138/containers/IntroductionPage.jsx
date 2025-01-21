import React from 'react';
import PropTypes from 'prop-types';
// import { useSelector, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
// import {
//   VaAlert,
//   VaAlertSignIn,
//   VaButton,
// } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
// import { TITLE, SUBTITLE, PrimaryActionLink } from '../config/constants';
import { TITLE, SUBTITLE } from '../config/constants';
// import SaveInProgressIntro from '../components/SaveInProgressIntro';

const IntroductionPage = props => {
  const { route } = props;
  // const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  // const handleLoadPrefill = () => null;
  // const handleLoadPrefill = () => {
  //   captureAnalytics();
  //   if (prefillAvailable) {
  //     props.fetchInProgressForm(
  //       // TODO: where does this come from?
  //       formId,
  //       migrations,
  //       true,
  //       prefillTransformer,
  //     );
  //   } else {
  //     goToBeginning();
  //   }
  // };

  const childContent = (
    <>
      <p>
        Use this form to provide additional information to support an existing
        claim.
      </p>
      <h2>What to know before you fill out this form</h2>
      <p>
        If you want to submit more than one statement, you’ll need to use a new
        form for each statement.
      </p>
      <h3>Not sure if this is the right form to use?</h3>
      <p>
        For more information about how to choose the best supporting form,{' '}
        <a
          href="/supporting-forms-for-claims/"
          target="_blank"
          rel="noopener noreferrer"
        >
          read about all our supporting forms.
        </a>
      </p>
      <h2>Start your form</h2>
    </>
  );

  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your statement',
    unauthStartText: 'Sign in or create an account',
    displayNonVeteranMessaging: true,
  };

  const ombInfo = {
    resBurden: '15',
    ombNumber: '2900-0075',
    expDate: '7/30/2027',
  };

  // const { formConfig, pageList } = route;
  // const customSipComponent = (
  //   <SaveInProgressIntro
  //     devOnly={{ forceShowFormControls: true }}
  //     headingLevel={2}
  //     prefillEnabled={formConfig.prefillEnabled}
  //     messages={formConfig.savedFormMessages}
  //     pageList={pageList}
  //     startText={content.authStartFormText}
  //     unauthStartText={content.unauthStartText}
  //     displayNonVeteranMessaging={content.displayNonVeteranMessaging}
  //     verifiedPrefillAlert={null}
  //     formConfig={formConfig}
  //     hideUnauthedStartLink={formConfig.hideUnauthedStartLink ?? false}
  //     customLink={null}
  //   >
  //     Save this thing in progress.
  //   </SaveInProgressIntro>
  // );
  // const customSipComponent = userIdVerified ? (
  //   <div>
  //     <VaAlert status="info" visible>
  //       <strong>Note:</strong> Since you’re signed in to your account, we can
  //       prefill part of your application based on your account details. You can
  //       also save your application in progress and come back later to finish
  //       filling it out.
  //     </VaAlert>
  //     <PrimaryActionLink
  //       href="#start"
  //       onClick={event => {
  //         event.preventDefault();
  //         handleLoadPrefill();
  //       }}
  //     >
  //       {content.authStartFormText}
  //     </PrimaryActionLink>
  //   </div>
  // ) : (
  //   <VaAlertSignIn variant="signInRequired" disable-analytics visible>
  //     <span slot="SignInButton">
  //       <VaButton
  //         text={content.unauthStartText}
  //         onClick={() => dispatch(toggleLoginModal(true, '', true))}
  //         uswds
  //       />
  //     </span>
  //   </VaAlertSignIn>
  // );

  return (
    <IntroductionPageView
      // additionalChildContent={customSipComponent}
      // additionalChildContent={null}
      childContent={childContent}
      content={content}
      devOnly={{ forceShowFormControls: true }}
      ombInfo={ombInfo}
      route={route}
      userIdVerified={userIdVerified}
      userLoggedIn={userLoggedIn}
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
