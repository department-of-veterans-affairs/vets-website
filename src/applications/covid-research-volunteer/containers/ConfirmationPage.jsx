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
          Thank you for volunteering for COVID-19 research
        </h2>
        <p>
          We appreciate your commitment to helping others through this important
          research effort.
        </p>
        <div className="inset">
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
        <div className="inset">
          <h2>If we don’t think you may be eligible for any studies</h2>
          <p>
            We won’t contact you. But we’ll keep your information on file for
            future studies you may be eligible to join.
          </p>
          <a href="/coronavirus-research">
            Learn more about participating in coronavirus research at VA
          </a>
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
