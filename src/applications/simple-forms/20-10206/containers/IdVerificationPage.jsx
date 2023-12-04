import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import footerContent from 'platform/forms/components/FormFooter';
import { isProfileLoading } from 'platform/user/selectors';
import getHelp from '../../shared/components/GetFormHelp';

const IdVerificationPage = props => {
  const { route, router, showLoadingIndicator } = props;
  const { formConfig } = route;
  const { location } = router;

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
              href="https://www.va.gov/resources/verifying-your-identity-on-vagov/"
              target="_blank"
              rel="noopener noreferrer"
              className="vads-c-action-link--green"
            >
              Verify your identity (opens in new tab)
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
            />
          </p>
          {footerContent({ formConfig, location })}
        </>
      )}
    </div>
  );
};

IdVerificationPage.propTypes = {
  route: PropTypes.object,
  router: PropTypes.object,
  showLoadingIndicator: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    user: state.user,
    showLoadingIndicator: isProfileLoading(state),
  };
};

export default connect(mapStateToProps)(IdVerificationPage);
