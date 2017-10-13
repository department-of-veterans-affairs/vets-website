import React from 'react';
import moment from 'moment';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../common/utils/helpers';

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
    const time = _.get('form.submission.response.timestamp', this.props);
console.log(response);
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

          <ul className="claim-list">
            <li>
              <strong>Date received</strong><br/>
              <span>{moment(form.submission.submittedAt).format('MMM D, YYYY')}</span>
            </li>
            <li>
              <strong>Confirmation number</strong><br/>
              <span>{response.confirmationNumber}</span>
            </li>
            <li>
              <strong>Your claim was sent to</strong><br/>
              <address className="schemaform-address-view">{response.regionalOffice}</address>
            </li>
          </ul>
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">What happens after I apply?</h4>
          <p className="confirmation-guidance-message"><a href="/health-care/after-you-apply">Find out what happens after you apply.</a></p>
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">If you have questions, call <a href="tel:+1-877-222-8387">1-877-222-VETS (8387)</a> and press 2.</p>
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
