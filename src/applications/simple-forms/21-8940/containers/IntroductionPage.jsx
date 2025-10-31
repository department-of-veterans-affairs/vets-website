import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import IdNotVerifiedAlert from '../../shared/components/IdNotVerified';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '45',
  ombNumber: '2900-0404',
  expDate: '08/31/2027',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle: 'VETERAN\'S APPLICATION FOR INCREASED COMPENSATION BASED ON UNEMPLOYABILITY (VA 21-8940) ',
    formSubTitle:
      '',
    authStartFormText: 'Start the veteran\'s application',
    saveInProgressText:
      'Please complete the 21-8940 form to provide information about your employment.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
      Hi there, welcome to VA Form 21-8940. Please use this form if you want to apply for Individual Unemployability disability benefits for a service-connected condition that prevents you from keeping a steady job. 
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
