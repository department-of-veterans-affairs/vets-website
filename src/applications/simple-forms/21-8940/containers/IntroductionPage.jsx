import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import IdNotVerifiedAlert from '../../shared/components/IdNotVerified';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '10',
  ombNumber: '2900-0404',
  expDate: '08/31/2027',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle: 'VETERAN\'S APPLICATION FOR INCREASED COMPENSATION BASED ON UNEMPLOYABILITY',
    formSubTitle:
      'Please take your time to complete this form as accurately as you can.',
    authStartFormText: 'Start the veteran\'s application',
    saveInProgressText:
      'Please complete the 21-8940 form to provide information about your employment.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
       IMPORTANT: You are receiving compensation at the 100 percent rate based on being unable to secure or follow a substantially gainful occupation as a result of your service-connected disabilities. Section I needs to be completed in order to identify the person filling out the form. If you were self-employed or employed by others, including the Department of Veterans Affairs, at any time during the past 12 months, complete Section II of this form. If you have not been employed during the past 12 months, complete Section III of this form. After completing the form, mail to: Department of Veterans Affairs, Evidence Intake Center, P.O. Box 4444, Janesville, WI 53547-4444.
      </p>
    {/**   <h2 className="vads-u-font-size--h3">
        What to know before you submit this form
      </h2>
      <ul className="vads-u-margin-bottom--4">
        <li>
          If you already provided your private, non-VA medical records to us, or
          if you intended to get them yourself, you don’t need to submit this
          form. Submitting the form in this case will add time to your claim
          process.
        </li>
        <li>
          You don’t need to submit this form to request VA medical records.
        </li>
        <li>
          By law, we can’t pay any fees that may come from requesting your
          medical records.
        </li>
      </ul>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3]  && (
          <IdNotVerifiedAlert formNumber="21-4140" formType="authorization" />
        )*/}
    </>
  );

  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      devOnly={{
        forceShowFormControls: true,
      }}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
