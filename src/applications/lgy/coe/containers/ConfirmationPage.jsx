import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop('topScrollElement');
  }

  render() {
    const { data, submission } = this.props.form;
    const name = data.veteranFullName;

    return (
      <div>
        <va-alert status="success">
          <h2 slot="headline" className="vads-u-font-size--h3">
            You've successfully submitted your request for a COE.
          </h2>
          <p className="vads-u-font-size--base">
            We'll review your request. If you qualify for a Certificate of
            Eligibility, we'll notify you by email to let you know how to get
            your COE.
          </p>
        </va-alert>
        <div className="inset">
          <h4>
            Request for a Certificate of Eligibility{' '}
            <span className="additional">(VA Form 26-1880)</span>
          </h4>

          {name && (
            <span>
              For: {name.first} {name.middle} {name.last} {name.suffix}
            </span>
          )}

          {submission && (
            <ul className="claim-list">
              <li>
                <h4>Date submitted</h4>
                {moment(submission.timestamp).format('MMMM D, YYYY')}
              </li>
            </ul>
          )}

          <button
            className="vads-u-margin-top--1p5 usa-button"
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </div>

        <h2>When will I hear back about my request for a COE?</h2>
        <div className="inset secondary">
          <h2 className="vads-u-margin--0 vads-u-padding-bottom--1 vads-u-border-bottom--1px">
            Within 5 business days
          </h2>
          <p>
            If more than 5 business days have passed since you submitted your
            request and you haven't heard back, please don't request a COE
            again. Call our toll-free number at{' '}
            <Telephone contact={'877-827-3702'} />.
          </p>
          <Link to="eligibility">
            Check the status of your VA home loan Certificate of Eligibility
          </Link>
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
