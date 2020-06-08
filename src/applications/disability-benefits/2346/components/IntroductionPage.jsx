import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchFormStatus } from '../actions';
import ErrorMessage from './ErrorMessage';
import UnverifiedPrefillAlert from './UnverifiedPrefillAlert';

class IntroductionPage extends Component {
  componentDidMount() {
    this.props.fetchFormStatus();
  }

  render() {
    const { isError, isLoggedIn, pending } = this.props;
    const showMainContent = !pending && !isError;

    return (
      <>
        {' '}
        <FormTitle title="Order hearing aid batteries and accessories" />
        <p>Equal to VA Form 2346A (Request for Batteries and Accessories).</p>
        {pending && (
          <LoadingIndicator setFocus message="Loading your information..." />
        )}
        {isError &&
          !pending &&
          isLoggedIn && (
            <div className="vads-u-margin-bottom--3">
              <ErrorMessage />
            </div>
          )}
        {showMainContent && (
          <div className="schemaform-intro">
            <SaveInProgressIntro
              hideUnauthedStartLink
              prefillEnabled={this.props.route.formConfig.prefillEnabled}
              messages={this.props.route.formConfig.savedFormMessages}
              pageList={this.props.route.pageList}
              verifyRequiredPrefill={
                this.props.route.formConfig.verifyRequiredPrefill
              }
              unverifiedPrefillAlert={<UnverifiedPrefillAlert />}
              startText="Order hearing aid batteries and accessories"
            >
              Please complete the 2346 form to apply for ordering hearing aid
              batteries and accessories.
            </SaveInProgressIntro>
            <h2
              className="vads-u-font-size--h3"
              itemProp="name"
              id="am-i-eligible-to-order-prosthe"
            >
              Follow the steps below to order hearing aid batteries and
              accessories.
            </h2>
            <div className="process schemaform-process">
              <ol>
                <li className="process-step list-one">
                  <h3 className="vads-u-font-size--h4">Prepare</h3>
                  <p>To place an order, you’ll need your:</p>
                  <ul>
                    <li>Shipping address</li>
                    <li>Email address</li>
                    <li>Hearing aid information</li>
                  </ul>
                  <p className="vads-u-font-weight--bold">
                    What if I need help with my order?
                  </p>
                  <p>
                    If you need help ordering hearing aid batteries and
                    accessories, you can call the Denver Logistics Center
                    Customer Service Section at{' '}
                    <a
                      aria-label="3 0 3. 2 7 3. 6 2 0 0."
                      href="tel:303-273-6200"
                    >
                      303-273-6200
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                  </p>
                </li>
                <li className="process-step list-two">
                  <h3 className="vads-u-font-size--h4">Place your order</h3>
                  <p>
                    Complete this hearing aid batteries and accessories order
                    form.
                  </p>
                  <p>
                    These are the steps you can expect when placing an order:
                  </p>
                  <ul>
                    <li>Confirm your personal information</li>
                    <li>
                      Confirm or edit your shipping address and email address
                    </li>
                    <li>Select any hearing aids that need batteries</li>
                    <li>Select any hearing aid accessories you need</li>
                    <li>Review and submit order</li>
                  </ul>
                  <p>
                    After submitting the order form, you’ll get a confirmation
                    message. You can print this for your records.
                  </p>
                </li>
                <li className="process-step list-three">
                  <h3 className="vads-u-font-size--h4">Track your order </h3>
                  <p>
                    You will receive an email with an order tracking number 1-2
                    days after your order is submitted.
                  </p>
                </li>
                <li className="process-step list-four">
                  <h3 className="vads-u-font-size--h4">Receive your order</h3>
                  <p>
                    You should receive your order within the timeframe indicated
                    by the order tracking number.
                  </p>
                  <p className="vads-u-font-weight--bold">
                    What if I have questions about my order?
                  </p>
                  <p>
                    If you have questions about your order, you can call the DLC
                    Customer Service Section at{' '}
                    <a
                      aria-label="3 0 3. 2 7 3. 6 2 0 0."
                      href="tel:303-273-6200"
                    >
                      303-273-6200
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.{' '}
                  </p>
                </li>
              </ol>
            </div>
            <SaveInProgressIntro
              buttonOnly
              hideUnauthedStartLink
              prefillEnabled={this.props.route.formConfig.prefillEnabled}
              messages={this.props.route.formConfig.savedFormMessages}
              pageList={this.props.route.pageList}
              startText="Order hearing aid batteries and accessories"
              unverifiedStartText="Sign in to start your order"
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.mdot.isError,
  pending: state.mdot.pending,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ fetchFormStatus }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
