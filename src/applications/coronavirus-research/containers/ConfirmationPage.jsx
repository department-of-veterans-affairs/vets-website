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
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    return (
      <div>
        <h2 className="confirmation-page-title">
          Thank you for signing up for our coronavirus research volunteer list
        </h2>
        <p>
          We appreciate your commitment to helping others through this important effort.
        </p>
        <div>
          <h2>
            If we think you may be eligible for one of our research studies
          </h2>
          <p>
            We’ll contact you to tell you more about it so you can decide if you
            want to join.
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
          <a href="/coronavirus-research">
            Learn more about volunteering for coronavirus research at VA
          </a>
        </div>
        <div>
          <h2>
            If you have questions or would like to be removed from the volunteer list
          </h2>
          <p>
            If you have questions, call us at <a href="tel:+18664416075" aria-label="8 6 6. 4 4 1. 6 0 7 5.">866-441-6075</a>, select 1. We're here Monday through Friday, 8:00 a.m. to 6:00 p.m.           
          </p>
          <p>
            You can decide to stop being part of this list at anytime. If you'd like to be removed from the list, send us an email at <a href="mailto:research@va.gov">research@va.gov</a>.
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
