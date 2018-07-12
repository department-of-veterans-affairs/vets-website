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
    const name = data.veteranFullName || { first: 'First', last: 'Last' }; // TODO: remove mock data

    return (
      <div>
        <h2 className="schemaform-confirmation-section-header">Your opt-out form has been submitted</h2>
        <p>We may contact you if we have questions or need more information. You can print this page for your records.</p>
        <h2 className="schemaform-confirmation-section-header">What happens after I submit my opt-out form?</h2>
        <p>We’ll send you a letter in the mail confirming that we’ve received your opt-out form. After we receive your form, it’ll take us about 48 hours to remove schools’ access to your education benefit information.</p>
        <h2 className="schemaform-confirmation-section-header">What should I do if I change my mind and no longer want to opt out?</h2>
        <p>You’ll need to call the Education Call Center at <a href="tel:+18884424551">1-888-442-4551</a>, Monday through Friday, 8:00 a.m. to 7:00 p.m. (ET), to ask VA to start sharing your education benefits information again.</p>
        <h2 className="schemaform-confirmation-section-header">If I’ve opted out, what type of information do I need to give my school?</h2>
        <p>You’ll need to provide your school with a copy of your education benefits paperwork. If you transfer schools, you’ll also need to make sure your new school has your paperwork.</p>
        <div className="inset">
          <h4>Opt Out of Sharing VA Education Benefits Information</h4>
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
          <p className="confirmation-guidance-message help-talk">For help filling out this form, please call the Education Call Center:</p>
          <p className="help-phone-number">
            <a className="help-phone-number-link" href="tel:+1-888-442-4551">1-888-442-4551</a><br/>
        Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. (ET)<br/>
            <a className="help-phone-number-link" href="https://gibill.custhelp.com/app/utils/login_form/redirect/ask">Submit a question to Education Service</a>
          </p>
          <p className="help-talk">To report a problem with this form,<br/>
          please call the Vets.gov Technical Help Desk:</p>
          <p className="help-phone-number">
            <a className="help-phone-number-link" href="tel:+1-855-574-7286">1-855-574-7286</a><br/>
            TTY: <a className="help-phone-number-link" href="tel:+18008778339">1-800-877-8339</a><br/>
            Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
          </p>
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
