import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

const ombInfo = {
  resBurden: '45',
  ombNumber: '2900-0404',
  expDate: '07/31/2027',
};

export const IntroductionPage = ({ route, userIdVerified, userLoggedIn }) => {
  const content = {
    formTitle:
      "VETERAN'S APPLICATION FOR INCREASED COMPENSATION BASED ON UNEMPLOYABILITY (VA 21-8940) ",
    formSubTitle: '',
    authStartFormText: "Start the veteran's application",
    saveInProgressText:
      'Please complete the 21-8940 form to provide information about your employment.',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };
  const childContent = (
    <>
      <p>
        Hi there, welcome to VA Form 21-8940. Please use this form if you want
        to apply for Individual Unemployability disability benefits for a
        service-connected condition that prevents you from keeping a steady job.
      </p>
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
