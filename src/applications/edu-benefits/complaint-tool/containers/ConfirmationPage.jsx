import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../../../platform/utilities/ui';

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

    return (
      <div>
        <h3 className="confirmation-page-title">Your feedback has been submitted</h3>
        <p>We may contact you if we have questions or need more information.</p>
        <p>Please print this page for your records.</p>
        <h3 className="confirmation-page-title">What happens after I submit my feedback?</h3>
        <p>We’ll get back to you within 45 days to let you know how we’re handling your feedback and if we’ve had any communication with your school. Feedback that isn't related to VA education benefits may be sent to another agency for review.</p>
        <p>If we need to get in touch with you, we’ll contact you from an email address that’ll look like this: process.vbavaco.va.gov. Please add this to your email contact list so you can respond to messages that may need a quick response from you.</p>
        <div className="inset">
          <h4>GI Bill® School Feedback <span className="additional">(Form 686)</span></h4>
          <span>for {name.first} {name.middle} {name.last} {name.suffix}</span>

          {response && <ul className="claim-list">
            <li>
              <strong>Date received</strong><br/>
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
          </ul>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
