import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import { focusElement } from 'platform/utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { verifyVaFileNumber } from '../actions';
import { IntroductionPageHeader } from '../components/IntroductionPageHeader';
import { IntroductionPageFormProcess } from '../components/IntroductionPageFormProcess';

// We need to check for the presence of VA file number by performing an API request to vets-api.
// If a VA file number exists, proceed with the form. If it doesn't, show an error.
// 1. Fire off an action on component did mount.
// 2. Action should fire off API call.
// 3. Reducer should consume response from action.
// 4. Component should update based on new state from reducer.

const VerifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your
        account is verified, we can prefill part of your application based on
        your account details. You can also save your form in progress and come
        back later to finish filling it out.
      </div>
    </div>
    <br />
  </div>
);

const VaFileNumberMissingAlert = (
  <>
    <h2 className="vads-u-margin-y--0 vads-u-font-size--lg">
      Your profile is missing some required information
    </h2>
    <p>
      The personal information we have on file for your is missing your VA file
      number.
    </p>
    <p>
      You'll need to update your personal information. Please call Veterans
      Benefits Assistance at{' '}
      <a href="tel: 800-827-1000" aria-label="800. 8 2 7. 1000.">
        800-827-1000
      </a>{' '}
      between 8:00 a.m. and 9:00 p.m. ET Monday through Friday.
    </p>
  </>
);
class IntroductionPage extends React.Component {
  componentDidMount() {
    this.props.verifyVaFileNumber();
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const {
      vaFileNumber: { hasVaFileNumber, isLoading },
      user,
    } = this.props;

    let ctaState;
    // Base case: user is logged out.
    // Case 1: User is logged in and we are checking for va file number.
    // Case 2: User is logged in and they have a valid va file number.
    // Case 3: User is logged in and they do not have a valid va file number.
    if (
      !user?.login?.currentlyLoggedIn ||
      (user?.login?.currentlyLoggedIn && hasVaFileNumber)
    ) {
      ctaState = (
        <SaveInProgressIntro
          {...this.props}
          hideUnauthedStartLink
          verifiedPrefillAlert={VerifiedAlert}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Add or remove a dependent"
        />
      );
    } else if (user?.login?.currentlyLoggedIn && isLoading) {
      ctaState = (
        <LoadingIndicator message="Verifying veteran account information..." />
      );
    } else {
      ctaState = (
        <AlertBox content={VaFileNumberMissingAlert} status="error" isVisible />
      );
    }

    const content = (
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
          pageList={this.props.route.pageList}
          startText="Add or remove a dependent"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0043" expDate="09/30/2021" />
        </div>
      </div>
    );
    return content;
  }
}

const mapStateToProps = state => {
  const { form, user, vaFileNumber } = state;
  return {
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
