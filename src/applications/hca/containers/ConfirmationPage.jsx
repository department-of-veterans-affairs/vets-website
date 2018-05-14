import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../../platform/utilities/ui';

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
        <h3 className="confirmation-page-title">Claim received</h3>
        <p>We usually process claims within <strong>a week</strong>.</p>
        <p>
          We may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>Health Care Benefit Claim <span className="additional">(Form 10-10EZ)</span></h4>
          <span>for {name.first} {name.middle} {name.last} {name.suffix}</span>

          {response && <ul className="claim-list">
            <li>
              <strong>Date received</strong><br/>
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
            <li>
              <strong>Confirmation number</strong><br/>
              <span>{response.formSubmissionId}</span>
            </li>
          </ul>}
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">What happens after I apply?</h4>
          <p className="confirmation-guidance-message"><a href="/health-care/after-you-apply/">Find out what happens after you apply.</a></p>
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">If you have questions, please call 1-877-222-VETS (<a href="tel:+18772228387">1-877-222-8387</a>) and press 2, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>
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
