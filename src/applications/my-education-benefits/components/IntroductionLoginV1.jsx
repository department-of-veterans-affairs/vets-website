import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VA_FORM_IDS } from 'platform/forms/constants';
import LoadingIndicator from './LoadingIndicator';

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
        <>
          If you don't want to sign in, you can apply using the{' '}
          <a href="https://www.va.gov/find-forms/about-form-22-1990/">
            paper form
          </a>
          . Please expect longer processing time for decisions when opting for
          this method.
        </>
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
  firstName: state.data?.formData?.data?.attributes?.claimant?.firstName,
  eligibility: state.data?.eligibility,
  user: state.user || {},
});
export default connect(mapStateToProps)(IntroductionLoginV1);
