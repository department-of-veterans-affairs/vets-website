import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import FormFooter from '../components/FormFooter';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const approvedPage = (
  <div className="meb-confirmation-page meb-confirmation-page_denied">
    <h1>You have been approved</h1>
    <div className="feature">
      <h3>
        Congratulations! We reviewed your application and have determined that
        you are entitled to educational benefits under the{' '}
        <strong>Post-9/11 GI Bill</strong>.
      </h3>
      <p>
        Your Certificate of Eligibility is now available. A physical copy will
        also be mailed to your mailing address.
      </p>
      <button type="button" className="usa-button">
        Download your Certificate of Eligibility
      </button>
      <a href="#">View an explanation of your benefits</a>
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

    <button className="usa-button-secondary">Download your application</button>

    <a href="#">Go to your My VA dashboard</a>

    <FormFooter />
  </div>
);

const deniedPage = (
  <div className="meb-confirmation-page meb-confirmation-page_denied">
    <h1>You are not eligible</h1>
    <div className="feature">
      <h3>
        Unfortunately, based on the information you provided and Department of
        Defense records, we have determined you are not eligible for the
        Post-9/11 GI Bill program at this time.
      </h3>
      <p>
        Your denial letter, which explains why you are ineligible, is now
        available. A physical copy will also be mailed to your mailing address.
      </p>
      <button type="button" className="usa-button">
        Download your letter
      </button>
      <a href="#">View an explanation of your benefits</a>
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
      please see <a href="#">VA Form 20-0998</a>,
      <em>Your Rights to Seek Further Review of Our Decision</em>.{' '}
    </p>

    <button className="usa-button-secondary">Download your application</button>

    <a href="#">Go to your My VA dashboard</a>

    <FormFooter />
  </div>
);

const pendingPage = (
  <div className="meb-confirmation-page meb-confirmation-page_denied">
    <h1>Your application is under review</h1>
    <div className="feature">
      <h3>
        Your application requires additional review. Once we have reviewed your
        application, we will reach out to notify you about next steps.
      </h3>
      <p>
        For now, you can download a copy of your application for your records.
      </p>
      <button type="button" className="usa-button">
        Download your application
      </button>
    </div>

    <h2>When will I hear back about my application?</h2>
    <div className="feature meb-feature--secondary">
      <h2>
        <em>In 1</em> Month
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
      <li>You will be notified about your eligibility.</li>
      <li>There is no further action required by you at this time.</li>
    </ul>

    <h2>What can I do while I wait?</h2>
    <ul>
      <li>
        Use our <a href="#">GI Bill Comparison Tool</a> to help you decide which
        education program and school is best for you.
      </li>
      <li>Upload any supporting documents.</li>
      <li>
        Review and/or update your direct deposit information on your{' '}
        <a href="#">VA.gov profile</a>.
      </li>
      <li>
        Learn more about VA benefits and programs through the{' '}
        <a href="#">Building Your Future with the GI Bill Series</a>.
      </li>
    </ul>

    <a href="#">Go to your My VA dashboard</a>

    <FormFooter />
  </div>
);

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;

    const confirmationResult = 'approved';

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
