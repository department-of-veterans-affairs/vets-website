import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { focusElement } from 'platform/utilities/ui';

import { WithdrawFromLegacySystem } from './WithdrawFromLegacySystem';

import { BASE_URL } from '../constants';

// import { VerifiedAlert } from '../helpers';

class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);

    // TODO: get Legacy status; should this value should be in the props.form?
    // Update this portion once the API has been added
    this.state = {
      isInLegacySystem:
        typeof props?.form?.isInLegacySystem === 'undefined'
          ? true
          : props.form.isInLegacySystem,
    };
  }

  componentDidMount() {
    if (
      !this.hasSavedForm() &&
      !window.location.pathname.endsWith('/introduction')
    ) {
      window.location.replace(`${BASE_URL}/introduction`);
    }
    focusElement('.va-nav-breadcrumbs-list');
  }

  hasSavedForm = () => {
    const { user } = this.props;
    return user?.profile?.savedForms
      .filter(f => moment.unix(f.metadata.expiresAt).isAfter())
      .find(f => f.form === this.props.formId);
  };

  authenticate = e => {
    e.preventDefault();
    this.props.toggleLoginModal(true);
  };

  userWithdrewFromLegacySystem = () => {
    // TODO: replace placeholder; Use API to get/set value; where should the
    // value set in the this.props.form?
    this.setState({ isInLegacySystem: false });
  };

  render() {
    const { user } = this.props;
    const isLoggedIn = user.login?.currentlyLoggedIn;

    return (
      <div className="schemaform-intro">
        <FormTitle title="Request a Higher-Level Review" />
        <p>Equal to VA Form 20-0996 (Higher-Level Review).</p>
        {isLoggedIn && this.state.isInLegacySystem ? (
          <WithdrawFromLegacySystem
            appId="withdraw-from-legacy-appeal-system"
            onContinue={() => this.userWithdrewFromLegacySystem()}
          />
        ) : (
          <>
            <CallToActionWidget appId="higher-level-review">
              <SaveInProgressIntro
                formId={this.props.route.formConfig.formId}
                prefillEnabled={this.props.route.formConfig.prefillEnabled}
                messages={this.props.route.formConfig.savedFormMessages}
                pageList={this.props.route.pageList}
                startText="Start the Request for a Higher-Level Review"
              >
                Please complete the 20-0996 form to apply for Higher-Level
                Review.
              </SaveInProgressIntro>
              <br />
              {/* TODO: Remove inline style after I figure out why
                .omb-info--container has a left padding */}
              <div
                className="omb-info--container"
                style={{ paddingLeft: '0px' }}
              >
                <OMBInfo
                  resBurden={30}
                  ombNumber="2900-0862"
                  expDate="02/28/2022"
                />
              </div>
            </CallToActionWidget>
            <br />
            <br />
          </>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { form, user } = state;
  return {
    form,
    user,
  };
}

const mapDispatchToProps = {
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);

export { IntroductionPage };
