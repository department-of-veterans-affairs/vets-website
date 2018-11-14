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
    const name = data.claimantFullName;

    return (
      <div>
        <h2 className="schemaform-confirmation-section-header">
          Your opt-out form has been submitted
        </h2>
        <p>
          We may contact you if we have questions or need more information. You
          can print this page for your records.
        </p>
        <h2 className="schemaform-confirmation-section-header">
          What happens after I submit my opt-out form?
        </h2>
        <p>
          After we receive your request, it may take us up to a week to remove
          your school’s access to your education benefits information.
        </p>
        <h2 className="schemaform-confirmation-section-header">
          What should I do if I change my mind and no longer want to opt out?
        </h2>
        <p>
          You’ll need to call the Education Call Center at{' '}
          <a href="tel:+18884424551">1-888-442-4551</a>, Monday through Friday,
          8:00 a.m. to 7:00 p.m. (ET), to ask VA to start sharing your education
          benefits information again.
        </p>
        <h2 className="schemaform-confirmation-section-header">
          If I’ve opted out, what type of information do I need to give my
          school?
        </h2>
        <p>
          You may need to provide your school with a copy of your education
          benefits paperwork. If you transfer schools, you may also need to make
          sure your new school has your paperwork.
        </p>
        <div className="inset">
          <h4>Opt Out of Sharing VA Education Benefits Information</h4>
          <span>
            for {name.first} {name.middle} {name.last} {name.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Confirmation number</strong>
                <br />
                <span>{response.attributes.confirmationNumber}</span>
              </li>
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>
                  {moment(response.attributes.timestamp).format('MMM D, YYYY')}
                </span>
              </li>
            </ul>
          )}
        </div>
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
