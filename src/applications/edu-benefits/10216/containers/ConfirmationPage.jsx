import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { GetFormHelp } from '../components/GetFormHelp';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }

  render() {
    // const { form } = this.props;
    // const { submission, formId, data } = form;
    // const submitDate = new Date(submission?.timestamp);
    // const { fullName } = data;

    return (
      <div>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2">
          To submit your form, follow the steps below
        </h2>
        <va-process-list>
          <va-process-list-item header="Download and save your form">
            <p>
              Make sure that your completed form is saved as a PDF on your
              device.
            </p>
            <va-link
              download
              filetype="PDF"
              href=""
              // fileName={''}
              text="Download VA Form 22-10216"
            />
          </va-process-list-item>
          <va-process-list-item header="Upload the form to the VA education portal">
            <p>
              Visit the{' '}
              <va-link
                external
                text="VA Education File Upload Portal(opens in a new tab)"
                href="https://www.va.gov/education/"
              >
                VA education portal
              </va-link>
              , and upload your saved VA Form 22-10216.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Submit your form">
            <p>Once uploaded, click submit to finalize your request.</p>
          </va-process-list-item>
        </va-process-list>
        <va-button
          uswds
          secondary
          class="screen-only vads-u-margin-top--1"
          text="Print this page"
          onClick={() => window.print()}
        />
        <h2 className="vads-u-font-size--h2 vads-u-margin-top--8">
          What are my next steps?
        </h2>
        <p>
          After submitting your exemption request, we will review your
          submission within 7-10 business days. Once we complete the review, we
          will email your school a letter with the decision. If we accept your
          request, we will include a copy of WEAMS form 1998 as confirmation in
          the letter. If we deny your request, we will explain the reason for
          rejection in the letter and provide further instructions for
          resubmission or additional steps.
        </p>
        <va-link-action
          href="/"
          text="Go back to VA.gov"
          class="vads-u-margin-top--1p5 vads-u-margin-bottom--3"
        />
        <va-need-help class="vads-u-margin-top--6">
          <div slot="content">
            <GetFormHelp />
          </div>
        </va-need-help>
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
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
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
