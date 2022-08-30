import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VA_FORM_IDS } from 'platform/forms/constants';

import LoadingIndicator from './LoadingIndicator';
import { getAppData } from '../selectors';

function IntroductionLoginV1({ firstName, eligibility, route, user }) {
  return (
    <>
      {user?.login?.currentlyLoggedIn &&
        firstName &&
        eligibility &&
        !user.profile.savedForms.some(
          p => p.form === VA_FORM_IDS.FORM_22_1990EZ,
        ) && <h2>Begin your application for education benefits</h2>}

      {!user.login.currentlyLoggedIn || (firstName && eligibility) ? (
        <SaveInProgressIntro
          testActionLink
          user={user}
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          pageList={route.pageList}
          hideUnauthedStartLink
          headingLevel={2}
          startText="Start your application"
        />
      ) : (
        <LoadingIndicator />
      )}

      {!user?.login?.currentlyLoggedIn && (
        <a href="/education/apply-for-education-benefits/application/1990/applicant/information">
          Start your application without signing in
        </a>
      )}
    </>
  );
}

IntroductionLoginV1.propTypes = {
  route: PropTypes.object.isRequired,
  eligibility: PropTypes.arrayOf(PropTypes.string),
  firstName: PropTypes.string,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getAppData(state),
  firstName: state.data?.formData?.data?.attributes?.claimant?.firstName,
});

export default connect(mapStateToProps)(IntroductionLoginV1);
