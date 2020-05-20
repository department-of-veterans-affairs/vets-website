import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { fireAnalytics } from '../analytics/helpers.js';

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
    fireAnalytics(this.props.form.data);
  }

  handlePrintClick = () => {
    window.print();
  };

  render() {
    const { submission } = this.props.form;
    const { response } = submission;
    let veteranFirstName = '';
    let veteranLastName = '';
    if (submission.data) {
      veteranFirstName = submission.data.veteranInformation.first;
      veteranLastName = submission.data.veteranInformation.last;
    }

    return (
      <>
        <div>
          <button onClick={this.handlePrintClick} className="usa-button">
            Print this page for your records
          </button>
          <div className="inset">
            <p className="vads-u-font-size--lg vads-u-font-family--serif vads-u-font-weight--bold">
              Thank you for submitting your application
            </p>
            <p className="vads-u-font-size--base vads-u-font-family--serif vads-u-font-weight--bold">
              Application for Declaration of Status of Dependents (Form 21-686c)
              and/or Request for Approval of School Attendance (Form 21-674)
            </p>
            {response && (
              <div>
                <p>for {`${veteranFirstName} ${veteranLastName}`}</p>
                <ul className="claim-list">
                  <li>
                    <strong>Date submitted</strong>
                    <br />
                    <span>
                      {moment(response.timestamp).format('MMM D, YYYY')}
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="vads-u-font-size--base vads-u-font-family--serif vads-u-font-weight--bold">
            How long will it take VA to make a decision on my application?
          </p>

          <p>
            We usually decide on applications within <strong>1 week</strong>. If
            we need you to provide more information or documents, we’ll contact
            you by mail.
          </p>
          <p>
            If we haven’t contacted you within a week after you submitted your
            application, <strong>please don’t apply again</strong>. Instead,
            please call our toll-free hotline at{' '}
            <a href="tel:877-222-8387">877-222-VETS</a> (877-222-8387). We’re
            here Monday through Friday, 8:00 am to 8:00 pm ET
          </p>

          <p className="vads-u-font-size--base vads-u-font-family--serif vads-u-font-weight--bold">
            How can I check the status of my application?
          </p>
          <ol className="process">
            <li className="process-step list-one">
              <strong>Sign in to VA.gov</strong>
              <p>
                You can sign in with your DS Logon, My HealtheVet, or ID.me
                account. If you completed this form without signing in, and you
                don’t have an account, you can create one now.
              </p>
            </li>
            <li className="process-step list-two">
              <strong>
                If you haven’t yet verified your identity, complete this process
                when prompted
              </strong>
              <p>
                This helps keep you information safe, and prevents fraud and
                identity theft. If you’ve already verified your identity with
                us, you won’t need to do this again..
              </p>
            </li>
            <li className="process-step list-three">
              <b>Go to your personalized My VA homepage</b>
              <p>
                Once you’re signed in, you can go to your homepage by clicking
                on the <strong>My VA link</strong> near the top right of any
                VA.gov page. You’ll find your application status information in
                the <strong>Your Applications</strong> section of you homepage.
              </p>
              <p>
                <strong>Please note:</strong> Your application status may take
                some time to appear on our homepage. If you don’t see it there
                right away, please check back later.
              </p>
            </li>
          </ol>
          <p className="vads-u-font-size--base vads-u-font-family--serif vads-u-font-weight--bold">
            How will I know if my application to add or remove dependents is
            approved?
          </p>
          <p className="vads-u-margin-bottom--6">
            We’ll send you a packet by U.S. mail that includes details of the
            decision on your claim. If you check your status online and see a
            decision, please allow 7 to 10 business days for your packet to
            arrive before contacting a VA call center.
          </p>
          <p className="vads-u-font-size--base vads-u-font-family--serif vads-u-font-weight--bold">
            What if I need to add or remove another dependent now or at a later
            time?
          </p>
          <p className="vads-u-margin-bottom--6">
            If something changes in your family status let VA know. Return to
            the{' '}
            <a href="/view-change-dependents/add-remove-form-686c">21-686c</a>{' '}
            form, select the option that describes your family status change and
            complete the form. This will update our records and your benefits
            pay will be adjusted accordingly.
          </p>
          <p className="vads-u-font-size--base vads-u-font-family--serif vads-u-font-weight--bold">
            What if I have more questions?
          </p>
          <p className="vads-u-margin-bottom--6">
            Please call <a href="tel:877-222-8387">877-222-VETS</a>{' '}
            (877-222-8387) and select 2. We’re here Monday through Friday, 8:00
            a.m. to 8:00 p.m. ET.
          </p>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
