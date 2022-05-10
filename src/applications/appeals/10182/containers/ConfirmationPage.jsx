import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { selectProfile } from 'platform/user/selectors';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { FORMAT_READABLE } from '../constants';
import { getSelected, getIssueName } from '../utils/helpers';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  render() {
    const { name = {}, form } = this.props;
    const { submission, formId, data } = form;
    const issues = getSelected(data || []).map((issue, index) => (
      <li key={index} className="vads-u-margin-bottom--0">
        {getIssueName(issue)}
      </li>
    ));
    const fullName = `${name.first} ${name.middle || ''} ${name.last}`;
    const submitDate = moment(submission?.timestamp);
    const handlers = {
      print: () => window.print(),
    };

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
        <p>We may contact you for more information or documents.</p>
        <p className="screen-only">Please print this page for your records.</p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Request a Board Appeal{' '}
            <span className="additional">(Form {formId})</span>
          </h3>
          for {fullName}
          {name.suffix && `, ${name.suffix}`}
          {submitDate.isValid() && (
            <p>
              <strong>Date submitted</strong>
              <br />
              <span>{submitDate.format(FORMAT_READABLE)}</span>
            </p>
          )}
          <strong>
            Issues
            {issues?.length > 1 ? 's' : ''} submitted
          </strong>
          <ul className="vads-u-margin-top--0">{issues || null}</ul>
          <button
            type="button"
            className="usa-button screen-only"
            onClick={handlers.print}
          >
            Print this for your records
          </button>
        </div>

        <h2 className="vads-u-font-size--h3">
          After you request a decision review
        </h2>
        <p>
          When we’ve completed your review, we will physically mail you a
          decision packet that includes details about our decision.{' '}
          <a href="/decision-reviews/after-you-request-review/">
            Learn more about what happens after you request a review
          </a>
          .
        </p>

        <h2 className="vads-u-font-size--h3">What should I do while I wait?</h2>
        <p>
          You don’t need to do anything unless we send you a letter asking for
          more information. If we schedule any exams for you, be sure not to
          miss them.
        </p>
        <p>
          If you requested an appeal and haven’t heard back from us yet, please
          don’t request another appeal. Call us at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} />.
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

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
    name: selectProfile(state)?.userFullName,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
