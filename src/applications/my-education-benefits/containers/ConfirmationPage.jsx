import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import FormFooter from '../components/FormFooter';

const approvedPage = (
  <div className="meb-confirmation-page meb-confirmation-page_approved">
    <va-alert onClose={function noRefCheck() {}} status="success">
      <h3 slot="headline">
        Congratulations! You have been approved for the Post-9/11 GI Bill
      </h3>
      <p>
        We reviewed your application and have determined that you are entitled
        to educational benefits under the Post-9/11 GI Bill. Your Certificate of
        Eligibility is now available. A physical copy will also be mailed to
        your mailing address.
      </p>
      <button type="button" className="usa-button">
        Download your Certificate of Eligibility
      </button>
      <a href="#">View a statement of your benefits</a>
    </va-alert>

    <div className="feature">
      <h3>Application for VA education benefits (Form 22-1990)</h3>
      <p>For Hector Oliver Stanley Jr.</p>
      <dl>
        <dt>Confirmation number</dt>
        <dd>V-EBC-8827</dd>
        <dt>Date received</dt>
        <dd>September 8, 2021</dd>
      </dl>
      <button type="button" className="usa-button">
        Print this page
      </button>
    </div>

    <h2>What happens next?</h2>
    <ul>
      <li>
        Download a copy of your <a href="#">Certificate of Eligibility</a>.
      </li>
      <li>
        Use our <a href="#">GI Bill Comparison Tool</a> to help you decide which
        education program and school is best for you.
      </li>
      <li>
        Once you’ve selected a school or program, you may bring your Certificate
        of Eligibility to your School Certifying Official to provide proof of
        eligibility.
      </li>
      <li>
        Review and/or update your direct deposit information on your{' '}
        <a href="#">VA.gov profile</a>.
      </li>
      <li>
        Learn more about VA benefits and programs through the{' '}
        <a href="#">Building Your Future with the GI Bill Series</a>.
      </li>
    </ul>

    <AdditionalInfo triggerText="What is a Certificate of Eligibility?">
      <p>
        A Certificate of Eligibility is an official document from the U.S.
        Department of Veterans Affairs that details your GI Bill benefit status.
        You may provide this official document to your educational institution
        to prove your eligibility status.
      </p>
      <a href="#" target="_blank" rel="noopener noreferrer">
        Understanding your Certificate of Eligibility
      </a>
    </AdditionalInfo>

    <a className="vads-c-action-link--green" href="#">
      Go to your My VA dashboard
    </a>

    <FormFooter />
  </div>
);

const deniedPage = (
  <div className="meb-confirmation-page meb-confirmation-page_denied">
    <va-alert onClose={function noRefCheck() {}} status="info">
      <h3 slot="headline">You’re not eligible for this benefit</h3>
      <p>
        Unfortunately, based on the information you provided and Department of
        Defense records, we have determined you are not eligible for the
        Post-9/11 GI Bill program at this time.
      </p>
      <p>
        Your denial letter, which explains why you are ineligible, is now
        available. A physical copy will also be mailed to your mailing address.{' '}
      </p>
      <button type="button" className="usa-button">
        Download your letter
      </button>
      <a href="#">View an explanation of your benefits</a>
    </va-alert>

    <div className="feature">
      <h3>Application for VA education benefits (Form 22-1990)</h3>
      <p>For Hector Oliver Stanley Jr.</p>
      <dl>
        <dt>Confirmation number</dt>
        <dd>V-EBC-8827</dd>
        <dt>Date received</dt>
        <dd>September 8, 2021</dd>
      </dl>
      <button type="button" className="usa-button">
        Print this page
      </button>
    </div>

    <h2>What happens next?</h2>
    <ul>
      <li>
        We will review your eligibility for other VA education benefit programs.
      </li>
      <li>You will be notified if you have potential eligibility.</li>
      <li>There is no further action required by you at this time.</li>
    </ul>
    <h2>What if I disagree with this decision?</h2>
    <p>
      If you disagree with our decision, you have until one year from the date
      of your letter to request an additional review. For more information,
      please see <a href="#">VA Form 20-0998</a>,{' '}
      <em>Your Rights to Seek Further Review of Our Decision</em>.{' '}
    </p>

    <a className="vads-c-action-link--green" href="#">
      Go to your My VA dashboard
    </a>

    <FormFooter />
  </div>
);

const pendingPage = (
  <div className="meb-confirmation-page meb-confirmation-page_denied">
    <va-alert onClose={function noRefCheck() {}} status="success">
      <h3 slot="headline">We’ve received your application</h3>
      <p>
        Your application requires additional review. Once we have reviewed your
        application, we will reach out to notify you about next steps.
      </p>
    </va-alert>

    <div className="feature">
      <h3>Application for VA education benefits (Form 22-1990)</h3>
      <p>For Hector Oliver Stanley Jr.</p>
      <dl>
        <dt>Confirmation number</dt>
        <dd>V-EBC-8827</dd>
        <dt>Date received</dt>
        <dd>September 8, 2021</dd>
      </dl>
      <button type="button" className="usa-button">
        Print this page
      </button>
    </div>

    <h2>When will I hear back about my application?</h2>
    <div className="feature meb-feature--secondary">
      <h2>
        <em>In 1</em> month
      </h2>
      <p>
        If more than a month has passed since you gave us your application and
        you haven’t heard back, please don’t apply again. Call our toll-free
        Education Call Center at <a href="tel:1-888-442-4551">1-888-442-4551</a>{' '}
        or <a href="tel:001-918-781-5678">001-918-781-5678</a> if you are
        outside the U.S.
      </p>
    </div>

    <h2>What happens next?</h2>
    <ul>
      <li>We will review your eligibility for the Post-9/11 GI Bill.</li>
      <li>We may reach out with questions about your application.</li>
      <li>
        You will be notified of the results of our review for potential
        eligibility.
      </li>
      <li>There is no further action required by you at this time.</li>
    </ul>

    <h2>What can I do while I wait?</h2>
    <ul>
      <li>
        If you need to submit documentation to VA, such as service records,
        please send this through our <a href="#">Ask VA feature</a>.
      </li>
      <li>
        Review and/or update your direct deposit information on{' '}
        <a href="#">your VA.gov profile</a>.
      </li>
      <li>
        Use our <a href="#">GI Bill Comparison Tool</a> to help you decide which
        education program and school is best for you.
      </li>
      <li>
        Learn more about VA benefits and programs through the{' '}
        <a href="#">Building Your Future with the GI Bill Series</a>.
      </li>
      <li>
        Measure your interests and skill levels and help figure out your career
        path with <a href="#">CareerScope®</a>.
      </li>
    </ul>

    <a className="vads-c-action-link--green" href="#">
      Go to your My VA dashboard
    </a>

    <FormFooter />
  </div>
);

const loadingPage = (
  <div className="meb-confirmation-page meb-confirmation-page_loading">
    <h1>Wait right there</h1>
    <p>We are currently processing your application.</p>
    <LoadingIndicator message="Loading your results" />
  </div>
);

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop('topScrollElement');
  }

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;

    const confirmationResult = 'loading';

    switch (confirmationResult) {
      case 'approved': {
        return approvedPage;
      }
      case 'denied': {
        return deniedPage;
      }
      case 'pending': {
        return pendingPage;
      }
      case 'loading': {
        return loadingPage;
      }
      default: {
        return (
          <div>
            <h3 className="confirmation-page-title">Claim received</h3>
            <p>
              We usually process claims within <strong>a week</strong>.
            </p>
            <p>
              We may contact you for more information or documents.
              <br />
              <i>Please print this page for your records.</i>
            </p>
            <div className="inset">
              <h4>
                My Education Benefits Claim{' '}
                <span className="additional">(Form 22-1990)</span>
              </h4>
              {name ? (
                <span>
                  for {name.first} {name.middle} {name.last} {name.suffix}
                </span>
              ) : null}

              {response ? (
                <ul className="claim-list">
                  <li>
                    <strong>Date received</strong>
                    <br />
                    <span>
                      {moment(response.timestamp).format('MMM D, YYYY')}
                    </span>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
