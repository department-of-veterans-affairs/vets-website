import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { focusElement } from 'platform/utilities/ui';
import React from 'react';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="VA Form 2346" />
        <p>Equal to VA Form 2346 (Request for Batteries and Accessories).</p>
        <SaveInProgressIntro
          hideUnauthedStartLink
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        >
          Please complete the 2346 form to apply for ordering hearing aid
          batteries and accessories.
        </SaveInProgressIntro>
        <h2 itemProp="name" id="am-i-eligible-to-order-prosthe">
          Follow the steps below to order hearing aid batteries aid accessories.
        </h2>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h3>Prepare</h3>
              <p>To place an order, you'll need your:</p>
              <ul>
                <li>Shipping address</li>
                <li>Email address</li>
                <li>Hearing aid information</li>
              </ul>
              <h4>What if I need help with my order?</h4>
              <p>
                If you need help ordering hearing aid and betteries and
                accessories, you cna contact the Devner Logistics Center (DLC)
                at <a href="tel:303-273-6200">303-273-6200</a>
              </p>
            </li>
            <li className="process-step list-two">
              <h3>Place your order</h3>
              <p>
                Complete this hearing aid batteries and accessories order form.
              </p>
              <p>These are the steps you can expect when placing an oder:</p>
              <ul>
                <li>Confirm your personal information</li>
                <li>Confirm or edit your shipping address and email address</li>
                <li>Select any hearing aids that need batteries</li>
                <li>Select any hearing aid accessories you need</li>
                <li>Review and submit order</li>
              </ul>
              <p>
                After submitting the order, you'll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h3>Track your order</h3>
              <p>
                You will recieve an email with an order tracking number 1-2 days
                after your order is submitted.
              </p>
            </li>
            <li className="process-step list-four">
              <h3>Review your order</h3>
              <p>
                You should recieve your order withing the timeframe indicated by
                the order tracking number.
              </p>
              <h4>What if I have questions about my order?</h4>
              <p>
                If you have questions about your order, you can contact the
                Denver Logistics Center (DLC) at{' '}
                <a href="tel:303-273-6200">303-273-6200</a>.{' '}
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          hideUnauthedStartLink
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        />
        <div className="omb-info--container vads-u-padding-left--0">
          <OMBInfo resBurden={30} ombNumber="2900-0862" expDate="02/28/2022" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
