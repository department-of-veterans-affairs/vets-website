import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import { selectProfile } from 'platform/user/selectors';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { SELECTED, SAVED_CLAIM_TYPE, WIZARD_STATUS } from '../constants';

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
    focusElement('.confirmation-page-title');
    scrollToTop();

    // reset the wizard
    window.sessionStorage.removeItem(WIZARD_STATUS);
    window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
  }

  render() {
    const { name = {}, form } = this.props;
    const { submission, formId } = form;
    const { response } = submission;
    const issues = (form.data?.contestedIssues || [])
      .filter(el => el[SELECTED])
      .map((issue, index) => (
        <li key={index} className="vads-u-margin-bottom--0">
          {issue.attributes.ratingIssueSubjectText}
        </li>
      ));
    const fullName = `${name.first} ${name.middle || ''} ${name.last}`;

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2>Request for Higher-Level Review</h2>
        </div>
        <h2 className="confirmation-page-title vads-u-font-size--h3">
          Your request has been submitted
        </h2>
        <p>
          We may contact you for more information or documents.
          <br className="screen-only" />
          <em className="screen-only">
            Please print this page for your records.
          </em>
        </p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Higher-Level Review{' '}
            <span className="additional">(Form {formId})</span>
          </h3>
          for {fullName}
          {name.suffix && `, ${name.suffix}`}
          {response && (
            <>
              <p>
                <strong>Date submitted</strong>
                <br />
                <span>{moment(response.timestamp).format('MMMM D, YYYY')}</span>
              </p>
              <strong>
                Issue
                {issues.length > 1 ? 's' : ''} submitted
              </strong>
              <ul className="vads-u-margin-top--0">{issues}</ul>
              <button
                className="usa-button screen-only"
                onClick={() => window.print()}
              >
                Print for your records
              </button>
            </>
          )}
        </div>

        <h2 className="vads-u-font-size--h3">
          After you request a decision review
        </h2>
        <p>
          When your review is complete, VA will mail you a decision packet that
          includes details about the decision on your case.{' '}
          <a href="/decision-reviews/after-you-request-review/">
            Learn more about what happens after you request a review
          </a>
          .
        </p>

        <h2 className="vads-u-font-size--h3">What should I do while I wait?</h2>
        <p>
          You don’t need to do anything unless VA sends you a letter asking for
          more information. If VA schedules any exams for you, be sure not to
          miss them.
        </p>
        <p>
          If you requested a decision review and haven’t heard back from VA yet,
          please don’t request another review. Call VA at{' '}
          <Telephone contact={CONTACTS.VA_BENEFITS} />.
        </p>
        <br />
        <a
          href="/claim-or-appeal-status/"
          className="usa-button usa-button-primary"
        >
          Check the status of your decision review
        </a>
        <p>
          <strong>Note</strong>: Please allow some time for your decision review
          to process through our system. It could take 7 to 10 days for it to
          show up in our claim status tool.
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    name: selectProfile(state)?.userFullName,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
