import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { focusElement } from 'platform/utilities/ui';
import { urls } from '../../all-claims/utils';

import { VerifiedAlert } from '../helpers';

class IntroductionPage extends React.Component {
  componentDidMount() {
    if (!this.hasSavedForm()) {
      window.location.replace(`${urls.v2}/introduction`);
    }
    focusElement('.va-nav-breadcrumbs-list');
  }

  hasSavedForm = () => {
    const { user } = this.props;
    return (
      user &&
      user.profile &&
      user.profile.savedForms
        .filter(f => moment.unix(f.metadata.expiresAt).isAfter())
        .find(f => f.form === this.props.formId)
    );
  };

  authenticate = e => {
    e.preventDefault();
    this.props.toggleLoginModal(true);
  };

  render() {
    const { user } = this.props;

    const isLoggedIn = user && user.login && user.login.currentlyLoggedIn;

    const itfAgreement = (
      <p className={`itf-agreement${isLoggedIn ? '' : ' unauthenticated'}`}>
        By clicking the button to start the disability application, you’ll
        declare your intent to file. This will reserve a potential effective
        date for when you could start getting benefits. You have 1 year from the
        day you submit your intent to file request to complete your application.
      </p>
    );

    return (
      <div className="schemaform-intro">
        <FormTitle title="File for increased disability compensation" />
        <p>
          Equal to VA Form 21-526EZ (Application for Disability Compensation and
          Related Compensation Benefits).
        </p>
        <CallToActionWidget appId="disability-benefits">
          <SaveInProgressIntro
            {...this.props}
            verifiedPrefillAlert={VerifiedAlert}
            verifyRequiredPrefill={
              this.props.route.formConfig.verifyRequiredPrefill
            }
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            startText="Start the Disability Compensation Application"
          />
        </CallToActionWidget>
        {itfAgreement}
        <h4>
          Follow the steps below to file a claim for increased disability
          compensation.
        </h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>
                  When you apply for a disability increase you’ll have a chance
                  to provide evidence to support your claim. Evidence could
                  include:
                </h6>
              </div>
              <ul>
                <li>
                  VA medical and hospital records that show your rated
                  disability has gotten worse
                </li>
                <li>
                  Private medical and hospital records that show your rated
                  disability has gotten worse
                </li>
                <li>
                  Supporting or lay statements from family, friends, or
                  coworkers with knowledge about your disability that has gotten
                  worse
                </li>
              </ul>
              <p>
                In some cases, you may need to turn in one or more supplemental
                forms to support your claim. For example, you’ll need to fill
                out another form if you’re claiming a dependent or applying for
                aid and attendance benefits.
                <br />
                <a href="/disability/how-to-file-claim/supplemental-forms/">
                  Learn what additional forms you may need to file with your
                  disability claim
                </a>
                .
              </p>
              <p>
                <strong>What if I need help with my application?</strong>
              </p>
              <p>
                If you need help submitting a claim for increase, you can
                contact a VA regional office and ask to speak to a counselor. To
                find the nearest regional office, please call{' '}
                <a href="tel:1-800-827-1000">800-827-1000</a>. An accredited
                representative, like a Veterans Service Officer (VSO), can also
                help you with your claim.
              </p>
              <p>
                <a href="/disability/get-help-filing-claim/">
                  Get help filing your claim
                </a>
                .
              </p>
              <div>
                <div className="usa-alert usa-alert-info schemaform-sip-alert">
                  <div className="usa-alert-body">
                    <p>
                      <strong>Disability ratings</strong>
                    </p>
                    <p>
                      Before filing a claim for increase, you might want to
                      check to see if you’re already receiving the maximum
                      disability rating for your claimed condition.
                    </p>
                    <p>
                      <a href="/disability/about-disability-ratings/">
                        Learn how VA assigns disability ratings
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <br />
              </div>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Apply</h5>
              </div>
              <p>Complete this disability compensation benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA Review</h5>
              </div>
              <p>
                We process applications in the order we receive them. The amount
                of time it takes us to process your claim depends on how many
                disabilities you’re claiming for increased benefits and how long
                it takes us to collect evidence needed to decide your claim.
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>Decision</h5>
              </div>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>
        <CallToActionWidget appId="disability-benefits">
          <SaveInProgressIntro
            {...this.props}
            buttonOnly
            verifiedPrefillAlert={VerifiedAlert}
            verifyRequiredPrefill={
              this.props.route.formConfig.verifyRequiredPrefill
            }
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            startText="Start the Disability Compensation Application"
          />
        </CallToActionWidget>
        {itfAgreement}
        {/* TODO: Remove inline style after I figure out why .omb-info--container has a left padding */}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={25} ombNumber="2900-0747" expDate="11/30/2017" />
        </div>
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
