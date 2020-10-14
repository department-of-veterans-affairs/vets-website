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
    const name = data.fullName;

    return (
      <div>
        <h2 className="confirmation-page-title">We've received your message</h2>
        <p>
          Thank you for contacting us. We usually process messages within 5
          business days.
        </p>
        <p>
          If we have questions, we may contact you for more information. If you
          provided an email address, you should also receive an email confirming
          the VA's receipt of your inquiry.
        </p>
        <p>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h3 className="confirmation-page-inset-title">Your message</h3>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Confirmation number</strong>
                <br />
                <span>{response.confirmationNumber}</span>
              </li>
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>
                  {moment(response.dateSubmitted).format('MMM D, YYYY')}
                </span>
              </li>
            </ul>
          )}
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
