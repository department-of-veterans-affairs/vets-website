import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../../components/GetFormHelp';

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

    const { confirmationNumber, timestamp } = submission.response || {};
    const { first, middle, last, suffix } = data.veteranFullName || {};

    return (
      <div>
        <h3 className="confirmation-page-title">
          Your claim has been submitted.
        </h3>
        <p>
          We process applications in the order we receive them. Please print
          this page for your records. We may contact you if we have questions or
          need more information.
        </p>
        <p>
          <strong>
            If your dependent is a child in school between the ages of 18 and 23
            years old,
          </strong>{' '}
          you’ll need to also fill out a Request for Approval of School
          Attendance (VA Form 21-674).
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf"
        >
          Download VA Form 21-674
        </a>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">
            What happens after I apply?
          </h4>
          <p>
            You’ll get a notice in the mail, once we’ve processed your claim.
          </p>
        </div>
        <div className="inset">
          <h4 className="schemaform-confirmation-claim-header">
            Declaration of Dependents Claim{' '}
            <span className="additional">(Form 21-686c)</span>
          </h4>
          <span>
            For {first} {middle} {last} {suffix}
          </span>

          {confirmationNumber && (
            <ul className="claim-list">
              <li>
                <strong>Confirmation number</strong>
                <br />
                <span>{confirmationNumber}</span>
              </li>
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>{moment(timestamp).format('MM/DD/YYYY')}</span>
              </li>
            </ul>
          )}
        </div>
        <FormFooter formConfig={{ getHelp: GetFormHelp }} />
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
