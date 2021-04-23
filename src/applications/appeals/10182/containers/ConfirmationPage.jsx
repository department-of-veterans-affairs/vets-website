import React from 'react';
import { format } from 'date-fns';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import { selectProfile } from 'platform/user/selectors';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { SELECTED, FORMAT_READABLE } from '../constants';
import { isValidDate } from '../validations';

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
  }

  render() {
    const { name = {}, form } = this.props;
    const { submission, formId } = form;
    const issues = (form.data?.contestableIssues || [])
      .filter(el => el[SELECTED])
      .map((issue, index) => (
        <li key={index} className="vads-u-margin-bottom--0">
          {issue.attributes.ratingIssueSubjectText}
        </li>
      ));
    const fullName = `${name.first} ${name.middle || ''} ${name.last}`;
    const submitDate = submission?.timestamp
      ? new Date(submission?.timestamp)
      : new Date();

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2>Request for Board Appeal</h2>
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
            Request a Board Appeal{' '}
            <span className="additional">(Form {formId})</span>
          </h3>
          for {fullName}
          {name.suffix && `, ${name.suffix}`}
          {isValidDate(submitDate) && (
            <p>
              <strong>Date submitted</strong>
              <br />
              <span>{format(submitDate, FORMAT_READABLE)}</span>
            </p>
          )}
          <strong>
            Condition
            {issues?.length > 1 ? 's' : ''} submitted
          </strong>
          <ul className="vads-u-margin-top--0">{issues || null}</ul>
          <button
            className="usa-button screen-only"
            onClick={() => window.print()}
          >
            Print this for your records
          </button>
        </div>

        <h2 className="vads-u-font-size--h3">After you request an appeal</h2>
        <p>
          When we’ve completed your review, we will mail you a decision packet
          that includes details about our decision.{' '}
          <a href="/decision-reviews/after-you-request-review/">
            Learn more about what happens after you request an appeal
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
          If you requested an appeal and haven’t heard back from VA yet, please
          don’t request another appeal. Call VA at{' '}
          <Telephone contact={CONTACTS.VA_BENEFITS} />.
        </p>
        <br />
        <a
          href="/claim-or-appeal-status/"
          className="usa-button usa-button-primary"
          aria-describedby="delay-note"
        >
          Check the status of your appeal
        </a>
        <p id="delay-note">
          <strong>Note</strong>: Please allow some time for your appeal to
          process through our system. It could take 7 to 10 days for it to show
          up in our claim status tool.
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
