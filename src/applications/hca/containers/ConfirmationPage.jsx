import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import { focusElement } from 'platform/utilities/ui';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;

    let emailMessage;

    const dateTitle = 'Date submitted';
    if (data.email) {
      emailMessage = (
        <div>
          <p>We’ll contact you by email if we:</p>
          <ul>
            <li>
              Successfully receive and process your application,
              <strong>or</strong>
            </li>
            <li>Can't process your application for any reason</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="confirmation-page">
        <p>
          <strong>Please print this page for your records.</strong>
        </p>
        <div className="inset">
          <h4 className="schemaform-confirmation-claim-header">
            Thank you for submitting your application
          </h4>
          <h5>
            Health Care Benefit Claim{' '}
            <span className="additional">(Form 10-10EZ)</span>
          </h5>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>{dateTitle}</strong>
                <br />
                <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
              </li>
            </ul>
          )}
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">
            How long will it take VA to make a decision on my application?
          </h4>
          <p className="how-long">
            We usually decide on applications within <strong>1 week</strong>.
          </p>
          {emailMessage}
          <p>
            If we need you to provide more information or documents, we’ll
            contact you by mail.
          </p>
          <p>
            <strong>
              If we haven’t contacted you within a week after you submitted your
              application
            </strong>
          </p>
          <p>
            Please don’t apply again. Instead, please call our toll-free hotline
            at <Telephone contact={CONTACTS['222_VETS']} />. We’re here Monday
            through Friday, 8:00 am to 8:00 pm{' '}
            <abbr title="eastern time">ET</abbr>.
          </p>
          <h4 className="confirmation-guidance-heading">
            How can I check the status of my application?
          </h4>
          <ol className="process-steps">
            <li className="process-step list-one">
              <p>
                <strong>Sign in to VA.gov</strong>
              </p>
              <p>
                You can sign in with your DS Logon, My HealteVet, or ID.me
                account. If you don’t have an account, you can create one now.
              </p>
            </li>
            <li className="process-step list-two">
              <p>
                <strong>
                  If you haven’t yet verified your identity, complete this
                  process when prompted
                </strong>
              </p>
              <p>
                This helps keep you information safe, and prevents fraud and
                identity theft. If you’ve already verified your identity with
                us, you won’t need to do this again.
              </p>
            </li>
            <li className="process-step list-three">
              <p>
                <strong>Go to your personalized My VA homepage</strong>
              </p>
              <p>
                Once you’re signed in, you can go to your homepage by clicking
                on the <strong>My VA</strong> link near the top right of any
                VA.gov page. You’ll find your application status information in
                the <strong>Your Applications</strong> section of you homepage.
              </p>
              <p>
                <strong>Please note: </strong>
                Your application status may take some time to appear on our
                homepage. If you don’t see it there right away, please check
                back later.
              </p>
            </li>
          </ol>
          <h4 className="confirmation-guidance-heading">
            How will I know if I’m enrolled in VA health care?
          </h4>
          <p>
            If enrolled, you’ll receive a Veterans Health Benefits Handbook in
            the mail within about 10 days.
          </p>
          <p>
            We’ll also call to welcome you to the VA health care program, help
            you with scheduling your first appointment, and answer any questions
            you may have about your health care benefits.
          </p>
          <p className="confirmation-guidance-message">
            <a href="/health-care/after-you-apply/">
              Find out what happens after you apply
            </a>
          </p>
          <h4 className="confirmation-guidance-heading">
            What if I have more questions?
          </h4>
          <p className="confirmation-guidance-message">
            Please call <Telephone contact={CONTACTS['222_VETS']} /> and select
            2. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <abbr title="eastern time">ET</abbr>.
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
