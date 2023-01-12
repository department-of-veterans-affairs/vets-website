import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectProfile } from 'platform/user/selectors';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { focusElement } from 'platform/utilities/ui';

import { FORMAT_READABLE } from '../constants';
import { getSelected, getIssueName } from '../utils/helpers';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollTo('topScrollElement');
  }

  render() {
    const { name = {}, form } = this.props;
    const { submission, data } = form;
    const issues = getSelected(data || []).map((issue, index) => (
      <li key={index} className="vads-u-margin-bottom--0">
        {getIssueName(issue)}
      </li>
    ));
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
          <h2>Application for Supplemental Claim</h2>
        </div>
        <va-alert status="success">
          <h2 slot="headline">Thank you for filing a Supplemental Claim</h2>
          <p>
            When we've completed our review, we'll mail you a decision packet
            the details of our decision.
          </p>
        </va-alert>
        <div className="inset">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
            Your information for this claim
          </h3>
          <h4>Your name</h4>
          {fullName ? (
            <div>
              {name.first} {name.middle} {name.last}
              {name.suffix ? `, ${name.suffix}` : null}
            </div>
          ) : null}

          {submitDate.isValid() ? (
            <p>
              <h4 className="vads-u-margin-top--0">
                Date you filed your claim
              </h4>
              <span>{submitDate.format(FORMAT_READABLE)}</span>
            </p>
          ) : null}
          <h4>Issue(s) for review</h4>
          <ul className="vads-u-margin-top--0">{issues}</ul>
          <button
            type="button"
            className="usa-button screen-only"
            onClick={window.print}
          >
            Print this for your records
          </button>
        </div>
        <h3>What to expect next</h3>
        <p>
          If we need more information, we'll contact you to tell you what other
          information you'll need to submit. We'll also tell you if we need to
          schedule an exam for you.
        </p>
        <p>
          When we've completed your review, we'll mail you a decision packet
          with the details of our decision.{' '}
          <a href="/decision-reviews/after-you-request-review/">
            Learn more about what happens after you request a review
          </a>
          .
        </p>
        <h3>What to do if you have questions now</h3>
        <p>
          You can call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />) We're here Monday through Friday,
          8:00 a.m. to 9:00 p.m. ET.
        </p>
        <p>
          Note: If you requested a decision review and haven't heard back from
          us yet, please don't request another review. Call us instead.
        </p>
        <a href="/track-claims/your-claims" className="usa-button">
          Track the status of your claim or appeal
        </a>
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
