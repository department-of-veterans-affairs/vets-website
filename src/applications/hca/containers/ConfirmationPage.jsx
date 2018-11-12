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
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;

    let emailMessage;

    const title = 'Your claim is pending';
    const dateTitle = 'Date submitted';
    if (data.email) {
      emailMessage = (
        <div>
          <p>
            Please look for an email from us letting you know when we
            successfully receive and process your application. If your
            application doesn’t go through for any reason, we'll also send you
            an email letting you know.
          </p>
          <p>
            If more than a week has passed since you submitted your application
            and you haven’t heard back, please don’t apply again. Call our
            toll-free hotline at 1-877-222-VETS (
            <a href="tel:+18772228387">1-877-222-8387</a>
            ).
          </p>
        </div>
      );
    }

    return (
      <div>
        <h3 className="confirmation-page-title">{title}</h3>
        <p>
          We usually process claims within <strong>a week</strong>.
        </p>
        {emailMessage}
        <p>
          We may contact you if we need more information or documents from you.
          <br />
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4 className="schemaform-confirmation-claim-header">
            Health Care Benefit Claim{' '}
            <span className="additional">(Form 10-10EZ)</span>
          </h4>
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
            What happens after I apply?
          </h4>
          <p className="confirmation-guidance-message">
            <a href="/health-care/after-you-apply/">
              Find out what happens after you apply.
            </a>
          </p>
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">
            If you have questions, please call 1-877-222-VETS (
            <a href="tel:+18772228387">1-877-222-8387</a>) and press 2, Monday
            &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
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
