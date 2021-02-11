import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { focusElement } from 'platform/utilities/ui';
import { hasSession } from 'platform/user/profile/utilities';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { verifyVaFileNumber } from '../actions';
import { IntroductionPageHeader } from '../components/IntroductionPageHeader';
import { IntroductionPageFormProcess } from '../components/IntroductionPageFormProcess';
import {
  VerifiedAlert,
  VaFileNumberMissingAlert,
  ServerErrorAlert,
} from '../config/helpers';
import { isServerError } from '../config/utilities';

const alertClasses =
  'vads-u-padding-y--2p5 vads-u-padding-right--4 vads-u-padding-left--2';
class IntroductionPage extends React.Component {
  componentDidMount() {
    if (hasSession()) {
      this.props.verifyVaFileNumber();
    }
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const {
      vaFileNumber: { hasVaFileNumber, isLoading },
      user,
      dependentsToggle,
    } = this.props;
    let ctaState;
    let content;
    // Base case: user is logged out.
    // Case 1: User is logged in and we are checking for va file number.
    // Case 2: User is logged in and they have a valid va file number.
    // Case 3: User is logged in and they do not have a valid va file number.
    if (dependentsToggle === undefined) {
      content = <LoadingIndicator message="Loading..." />;
    } else if (!dependentsToggle) {
      content = (
        <>
          <h1>Application to add or remove dependents</h1>
          <AlertBox
            status="info"
            headline="We’re still working on this feature"
            level="2"
            content={
              <>
                <p>
                  We’re rolling out the Form 21-686c (Application to add and/or
                  remove dependents) in stages. It’s not quite ready yet. Please
                  check back again soon.{' '}
                </p>
                <a
                  href="/view-change-dependents/"
                  className="u-vads-display--block u-vads-margin-top--2"
                >
                  Return to Dependents Benefits page
                </a>
              </>
            }
          />
        </>
      );
    } else if (user?.login?.currentlyLoggedIn && hasVaFileNumber?.errors) {
      const errCode = hasVaFileNumber.errors[0].code;
      ctaState = isServerError(errCode) ? (
        <AlertBox
          className={alertClasses}
          content={ServerErrorAlert}
          status="error"
          isVisible
        />
      ) : (
        <AlertBox
          className={alertClasses}
          content={VaFileNumberMissingAlert}
          status="error"
          isVisible
        />
      );
      content = (
        <div className="schemaform-intro">
          <IntroductionPageHeader />
          {ctaState}
        </div>
      );
    } else if (
      user?.login?.currentlyLoggedIn &&
      !hasVaFileNumber?.VALIDVAFILENUMBER &&
      !isLoading
    ) {
      content = (
        <div className="schemaform-intro">
          <IntroductionPageHeader />
          <AlertBox
            className={alertClasses}
            content={VaFileNumberMissingAlert}
            status="error"
            isVisible
          />
        </div>
      );
    } else if (user?.login?.currentlyLoggedIn && isLoading) {
      ctaState = (
        <LoadingIndicator message="Verifying veteran account information..." />
      );
      content = (
        <div className="schemaform-intro">
          <IntroductionPageHeader />
          {ctaState}
          <IntroductionPageFormProcess />
        </div>
      );
    } else {
      ctaState = (
        <SaveInProgressIntro
          {...this.props}
          hideUnauthedStartLink
          verifiedPrefillAlert={VerifiedAlert}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          downtime={this.props.route.formConfig.downtime}
          pageList={this.props.route.pageList}
          startText="Add or remove a dependent"
        />
      );
      content = (
        <div className="schemaform-intro">
          <IntroductionPageHeader />
          {ctaState}
          <IntroductionPageFormProcess />
          <SaveInProgressIntro
            {...this.props}
            hideUnauthedStartLink
            buttonOnly
            verifiedPrefillAlert={VerifiedAlert}
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            downtime={this.props.route.formConfig.downtime}
            pageList={this.props.route.pageList}
            startText="Add or remove a dependent"
          />
          <div className="omb-info--container vads-u-padding-left--0">
            <OMBInfo
              resBurden={30}
              ombNumber="2900-0043"
              expDate="09/30/2021"
            />
          </div>
        </div>
      );
    }

    return content;
  }
}

const mapStateToProps = state => {
  const { form, user, vaFileNumber } = state;
  const dependentsToggle = toggleValues(state)[
    FEATURE_FLAG_NAMES.vaViewDependentsAccess
  ];
  return {
    dependentsToggle,
    form,
    user,
    vaFileNumber,
  };
};

const mapDispatchToProps = {
  verifyVaFileNumber,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);

export { IntroductionPage };
