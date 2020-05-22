import React from 'react';
import moment from 'moment';
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
    const { submission, data, formId } = this.props.form;
    const { response } = submission;
    const name = data.name;

    return (
      <div>
        <h3 className="confirmation-page-title">
          Your request has been submitted
        </h3>
        <p>
          We’ll mail you a letter confirming your request within{' '}
          <strong>5 business days</strong>.
        </p>
        <p>
          We may contact you for more information or documents.
          <br />
          <em>Please print this page for your records.</em>
        </p>
        <div className="inset" role="presentation">
          <h4 className="vads-u-margin-top--0">
            Higher-Level Review{' '}
            <span className="additional" role="presentation">
              (Form {formId})
            </span>
          </h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Date submitted</strong>
                <br />
                <span role="presentation">
                  {moment(response.timestamp).format('MMM D, YYYY')}
                </span>
              </li>
            </ul>
          )}
        </div>

        <h3>What happens after I submit a request for a review?</h3>
        <p>
          When your review is complete, VA will mail you a decision packet that
          includes details about the decision on your case.{' '}
          <a href="/decision-reviews/after-you-request-review/">
            Learn more about what happens after you request a review
          </a>
          .
        </p>

        <h3>What should I do while I wait?</h3>
        <p>
          You don’t need to do anything unless VA sends you a letter asking for
          more information. If VA schedules any exams for you, be sure not to
          miss them.
        </p>
        <p>
          If you requested a decision review and haven’t heard back from VA yet,
          please don’t request another review. Call VA at{' '}
          <a href="tel:1-800-827-1000">800-827-1000</a>.
        </p>
        <br />
        <a
          href="/claim-or-appeal-status/"
          className="usa-button usa-button-primary"
        >
          Track the status of your decision review
        </a>
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
