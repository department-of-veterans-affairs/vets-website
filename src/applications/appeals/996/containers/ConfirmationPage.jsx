import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import { selectProfile } from 'platform/user/selectors';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { SAVED_CLAIM_TYPE, WIZARD_STATUS } from '../constants';

import { DateSubmitted } from '../../shared/components/DateSubmitted';
import { IssuesSubmitted } from '../../shared/components/IssuesSubmitted';
import { getIssuesListItems } from '../../shared/utils/issues';

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
    const { submission, formId, data } = form;
    const { response } = submission;
    const issues = data ? getIssuesListItems(data) : [];
    const fullName = `${name.first} ${name.middle || ''} ${name.last}`;
    const submitDate = moment(submission?.timestamp);

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
        <p>We may contact you for more information or documents.</p>
        <p className="screen-only">Please print this page for your records.</p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Higher-Level Review{' '}
            <span className="additional">(Form {formId})</span>
          </h3>
          for{' '}
          <span className="dd-privacy-hidden" data-dd-action-name="full name">
            {fullName}
          </span>
          {name.suffix && (
            <span className="dd-privacy-hidden" data-dd-action-name="suffix">
              {`, ${name.suffix}`}
            </span>
          )}
          {response && (
            <>
              {submitDate.isValid() && (
                <DateSubmitted submitDate={submitDate} />
              )}
              <IssuesSubmitted issues={issues} />
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
          <va-telephone contact={CONTACTS.VA_BENEFITS} />.
        </p>
        <br role="presentation" />
        <a
          href="/claim-or-appeal-status/"
          className="vads-c-action-link--green"
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

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.instanceOf(Date),
      response: PropTypes.shape({}),
    }),
  }),
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
    name: selectProfile(state)?.userFullName,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
