import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../../../platform/utilities/ui';
import AskVAQuestions from '../../../../platform/forms/components/AskVAQuestions';

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
    const { response } = submission;
    const name = data.applicantFullName;

    return (
      <div>
        <h3 className="confirmation-page-title">
          Your feedback has been submitted
        </h3>
        <p>We may contact you if we have questions or need more information.</p>
        <p>Please print this page for your records.</p>
        <h3 className="confirmation-page-title">
          What happens after I submit my feedback?
        </h3>
        <p>
          We’ll get back to you within 45 days to let you know how we’re
          handling your feedback. We may contact you if we need more information
          from you.
        </p>
        <p>
          Feedback that isn’t related to VA education benefits may be sent to
          another agency for review.
        </p>
        {(response || name) && (
          <div className="inset">
            <h4>GI Bill® School Feedback Tool</h4>
            {name && (
              <span>
                for {name.first} {name.middle} {name.last} {name.suffix}
              </span>
            )}

            {response && (
              <ul className="claim-list">
                <li>
                  <strong>Date received</strong>
                  <br />
                  <span>{moment().format('MMM D, YYYY')}</span>
                </li>
                <li>
                  <strong>Confirmation number</strong>
                  <br />
                  <span>{response.caseNumber}</span>
                </li>
              </ul>
            )}
          </div>
        )}
        <div>
          <AskVAQuestions>
            <GetFormHelp />
          </AskVAQuestions>
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
