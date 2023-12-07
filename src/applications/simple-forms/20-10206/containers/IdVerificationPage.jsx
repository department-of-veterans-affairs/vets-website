import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import footerContent from 'platform/forms/components/FormFooter';
import { isProfileLoading, isLoggedIn, isLOA3 } from 'platform/user/selectors';
import getHelp from '../../shared/components/GetFormHelp';

const IdVerificationPage = props => {
  const {
    route,
    router,
    isLoadingFeatures,
    isLoadingProfile,
    userIdVerified,
    userLoggedIn,
  } = props;
  const { formConfig } = route;
  const { location } = router;
  const showLoadingIndicator = isLoadingFeatures || isLoadingProfile;

  formConfig.getHelp = getHelp;

  return (
    <div className="schemaform-intro">
      {showLoadingIndicator ? (
        <va-loading-indicator
          label="Loading"
          message="Loading your application..."
        />
      ) : (
        <>
          <FormTitle
            title="Request personal records"
            subTitle="Freedom of Information Act (FOIA) or Privacy Act (PA) Request (VA Form 20-10206)"
          />
          <va-alert
            class="vads-u-margin-bottom--1"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            slim
            status="error"
            uswds
            visible="true"
          >
            <h3 slot="headline">We need to verify your identity</h3>
            <p className="vads-u-font-size--base">
              We’re sorry, you’ll need to verify your identity before you can
              continue with this request.
            </p>
          </va-alert>
          <h2>Identity verification for VA.gov</h2>
          <p>
            To manage certain tasks and information on VA.gov, like requesting
            personal records or changing your direct deposit information, you’ll
            need to create a Login.gov or ID.me account and verify your
            identity.
          </p>
          <p>
            <a
              href="/verify?next=/records/request-personal-records-form-20-10206/introduction"
              className="vads-c-action-link--green"
              data-testid="id-verification-link"
            >
              Verify your identity
            </a>
          </p>
          <p>
            Once you’re verified, you can come back to complete your request
            online.
          </p>
          <p>
            If you don’t want to verify your identity right now, you can still
            download and complete the .pdf version of this request.
          </p>
          <p>
            <va-link
              download
              href="https://www.vba.va.gov/pubs/forms/VBA-20-10206-ARE.pdf"
              text="Download VA Form 20-10206 (PDF)"
              data-testid="download-link"
            />
          </p>
          <div className="test-only">
            <p>
              [userLoggedIn: {userLoggedIn ? 'true' : 'false'}; userIdVerified:{' '}
              {userIdVerified ? 'true' : 'false'}]
            </p>
          </div>
          {footerContent({ formConfig, location })}
        </>
      )}
    </div>
  );
};

IdVerificationPage.propTypes = {
  isLoadingFeatures: PropTypes.bool,
  isLoadingProfile: PropTypes.bool,
  route: PropTypes.object,
  router: PropTypes.object,
  userIdVerified: PropTypes.bool,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoadingFeatures: state.featureToggles.loading,
  isLoadingProfile: isProfileLoading(state),
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IdVerificationPage);
