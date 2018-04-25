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
    /*
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;
    */
    const response = {
      confirmationNumber: '234234234234',
      timestamp: '20180404'
    };

    const name =  {
      first: 'first',
      last: 'last'
    };

    return (
      <div>
        <h3 className="confirmation-page-title">Claim submitted</h3>
        <p>We process applications in hte order we receive them. Please print this page for your records. We may contact you if we have questions or need more information.</p>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">What happens after I apply?</h4>
          <p>You’ll get a notice in the mail, once we’ve processed your claim.</p>
          <h4 className="confirmation-guidance-heading">If you’re claiming a child who’s in school:</h4>
          <p>If you’re claiming a child in school between the ages of 18 and 23 years old, you’ll need to fill out a Request for Approval of School Attendence (VA Form 21-674).</p>
          <a href="https://www.vets.gov">Download VA Form 21-674</a>
        </div>
        <div className="inset">
          <h4>Declaration of Dependents Claim <span className="additional">(Form 21-686c)</span></h4>
          <span>for {name.first} {name.middle} {name.last} {name.suffix}</span>

          {response && <ul className="claim-list">
            <li>
              <strong>Confirmation number</strong><br/>
              <span>{response.confirmationNumber}</span>
            </li>
            <li>
              <strong>Date submitted</strong><br/>
              <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
            </li>
          </ul>}
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">If you have questions, call <a href="tel:+1-800-827-1000">1-800-827-1000</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 9:00 p.m. (ET). Please have your Social Security number or VA file number ready. For Telecommunication Relay Services, dial <a href="tel:711">711</a>.</p>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">Go Back to Vets.gov</button>
            </a>
          </div>
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
