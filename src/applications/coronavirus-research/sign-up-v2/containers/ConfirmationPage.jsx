import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

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
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    return (
      <div>
        <h2 className="confirmation-page-title">
          Thank you for signing up for our coronavirus research volunteer list
        </h2>
        <p>
          We appreciate your commitment to helping others through this important
          effort.
        </p>
        <div>
          <h2>
            If we think you may be eligible for one of our research studies
          </h2>
          <p>
            We’ll call you at the phone number you listed on the sign-up form.
            We'll tell you more about the study and any partner organizations we
            might work with to conduct it. We’ll also answer any questions you
            may have so you can decide if you want to join. want to join.
          </p>
          <p>
            Please understand that some studies have specific requirements. So
            it may be weeks or months before there’s a study that you may be
            eligible to join.
          </p>
          <p>
            <strong>Note:</strong> We’ll never ask for an ID number or for your
            financial, credit, or bank account information over the phone. For
            tips on how to avoid coronavirus-related scams, visit the{' '}
            <a href="https://www.ftc.gov/coronavirus/scams-consumer-advice">
              Federal Trade Commission (FTC) website
            </a>
          </p>
        </div>
        <div>
          <h2>If we don’t think you may be eligible for any studies</h2>
          <p>
            We won’t contact you. But we’ll keep your information on file for
            future studies you may be eligible to join.
          </p>
          <p>
            <a href="/coronavirus-research/">
              Learn more about volunteering for coronavirus research at VA
            </a>
          </p>
        </div>
        <div>
          <h2>
            If you have questions or would like us to remove you from the
            volunteer list
          </h2>
          <p>
            Send us an email at{' '}
            <a href="mailto:research@va.gov">research@va.gov</a>.
          </p>
          <p>
            You can ask us to remove you from the list at any time. In your
            email, tell us your name, phone number, and email you listed on the
            volunteer form. We'll remove you from the list and we won't contact
            you again about these research studies.
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
