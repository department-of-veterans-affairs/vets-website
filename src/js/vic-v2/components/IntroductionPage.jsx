import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { focusElement } from '../../common/utils/helpers';
import FormTitle from '../../common/schemaform/components/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../common/schemaform/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  renderSignInMessage = () => {
    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            If you're signed in to your account, the application process can go more smoothly. Here's why:
            <br/>
            <ul>
              <li>We can prefill part of your application based on your account details.</li>
              <li>You can save your form in progress, and come back later to finish filling it out.</li>
              <li>You could get your card sooner because we can confirm your Veteran status more quickly.</li>
            </ul>
            {!this.props.saveInProgress.user.login.currentlyLoggedIn && <p><button className="va-button-link" onClick={() => this.props.saveInProgressActions.toggleLoginModal(true)}>Sign in to your account.</button></p>}
          </div>
        </div>
        <br/>
      </div>
    );
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for a Veteran ID Card"/>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          pageList={this.props.route.pageList}
          startText="Start the VIC Application"
          renderSignInMessage={this.renderSignInMessage}
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the VIC form to apply for a card
        </SaveInProgressIntro>
        <h4>Follow the steps below to apply for a Veteran ID Card.</h4>
        <div className="process schemaform-process schemaform-process-sip">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>When you apply, be sure to have these on hand:</h6></div>
              <ul>
                <li>Your Social Security number</li>
                <li>A digital copy of your DD214 or other military discharge papers that you can upload</li>
                <li>A current color photo of yourself</li>
              </ul>
              <div className="vic-intro-indent">
                <div><h6>The photo has to follow the guidance listed below. It must:</h6></div>
                <ul>
                  <li>Show a full front view of your face and neck, (with no hat, head covering, or headphones covering or casting shadows on your hairline or face), and</li>
                  <li>Be cropped from your shoulders up (much like a passport photo), and</li>
                  <li>Show you with your eyes open and a neutral expression, and</li>
                  <li>Be a square size and have a white or plain-color background (with no scenery or other people in the photo)</li>
                  <li>Be uploaded as a .jpeg, .png, .bmp, or .tiff file</li>
                </ul>
              </div>
              <div className="usa-alert usa-alert-info">
                <div className="usa-alert-body">
                  <h4 className="usa-alert-heading">Do I have to sign in to Vets.gov to apply for a Veteran ID Card?</h4>
                  <div className="usa-alert-text">
                    <p>You don’t have to sign in to fill out the VIC application. But signing in with your DS Logon or ID.me account can make applying easier—and will help you get a decision faster.</p>
                    <p>If you already have a premium DS Logon account, you can sign in with your DS Logon information and we’ll connect your account to Vets.gov through ID.me. ID.me is our trusted technology partner, providing the strongest identity verification system available to prevent fraud and identity theft, and to protect your information.</p>
                    <p>If you don’t have an ID.me account and want to go through the ID.me identity-proofing process, you’ll need:</p>
                    <ul>
                      <li>A smartphone (or a landline or mobile phone and a computer with an Internet connection), <strong>and</strong></li>
                      <li>Your Social Security number, <strong>and</strong></li>
                      <li>Proof of your identity (your driver’s license or passport, or the ability to answer questions based on private and public data—like your credit report)</li>
                    </ul>
                    <a href="/faq">Get more information about signing in to Vets.gov.</a><br/>
                    {!this.props.saveInProgress.user.login.currentlyLoggedIn && <p><button className="va-button-link" onClick={() => this.props.saveInProgressActions.toggleLoginModal(true)}>Sign in to your account.</button></p>}
                  </div>
                </div>
              </div>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this VIC application.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We process claims in the order we receive them.</p>
              <p>We’ll review your application to verify your eligibility. We may contact you if we have any questions or need more information.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <p>Once we verify your application, you should receive your Veteran ID Card in the mail in about 60 days.</p>
            </li>
          </ol>
        </div>
        {!this.props.saveInProgress.user.login.currentlyLoggedIn && <p><button className="va-button-link" onClick={() => this.props.saveInProgressActions.toggleLoginModal(true)}>Sign in to your account.</button></p>}
        <SaveInProgressIntro
          buttonOnly
          pageList={this.props.route.pageList}
          startText="Start the VIC application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    saveInProgress: introSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);

export { IntroductionPage };
