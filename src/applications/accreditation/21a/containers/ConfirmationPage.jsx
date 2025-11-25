import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const ConfirmationPage = props => {
  const { submission } = props.form;
  const submitDate = new Date(submission?.timestamp);
  const onPrintPageClick = () => {
    window.print();
  };

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert status="success" visible>
        <h2 slot="headline">
          You’ve submitted your application for VA accreditation on{' '}
          {submitDate ? format(submitDate, 'MMMM d, yyyy') : ''}
        </h2>
        <p className="vads-u-margin-y--0">
          Thank you for submitting your application for VA accreditation. Each
          application is unique, and the circumstances determine the amount of
          time needed for due diligence in our decisions. Our time and resources
          are committed to ensuring Veterans receive responsible and qualified
          representation.
        </p>
      </va-alert>

      <h2 className="vads-u-margin-top--4">Save a copy of your form</h2>
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <h3 className="vads-u-font-size--h4 vads-u-margin-top--4 vads-u-margin-bottom--0">
        Print this confirmation page
      </h3>
      <p className="vads-u-margin-y--2">
        If you’d like to keep a copy of the information on this page, you can
        print it now.
      </p>
      <va-button
        onClick={onPrintPageClick}
        text="Print this page for your records"
      />

      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
        What to expect
      </h2>
      <ul className="vads-u-margin-y--0">
        <li>
          We will review your application and reach out to you if we have
          questions or need additional information.
        </li>
        <li>
          Attorney applications are typically processed within 60 to 120 days
          from the date of submission. Because the process includes more steps,
          claims agent applications take, on average, 1 year to process.
        </li>
        <li>
          If you change your mind and would like to withdraw your application
          for accreditation, contact OGC using the Accreditation Mailbox at{' '}
          <a href="mailto:ogcaccreditationmailbox@va.gov">
            ogcaccreditationmailbox@va.gov
          </a>
          .
        </li>
        <li>
          If you are applying for accreditation as a claims agent, you are
          required to pass a written examination before you can be accredited.
          We will reach out to you to schedule your examination if we make a
          favorable preliminary determination on your character and reputation.
        </li>
        <li>
          We will provide you with notice of our decision on your application.
          If your application is denied, we will notify you of your options
          should you disagree with our decision.
        </li>
      </ul>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
        How do I update my application?
      </h2>
      <ul className="vads-u-margin-y--0">
        <li>
          It is your responsibility to keep the Office of General Counsel
          updated regarding changes to the information in your application prior
          to our decision on your application. If you need to update your
          application because of a change in your situation, contact OGC using
          the Accreditation Mailbox at{' '}
          <a href="mailto:ogcaccreditationmailbox@va.gov">
            ogcaccreditationmailbox@va.gov
          </a>
          .
        </li>
        <li>
          You should update your application if your address changes, your
          employment situation changes, you are charged with a crime, or you
          experience any other significant change that might be relevant to your
          application for accreditation.
        </li>
      </ul>

      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
        What if I have questions?
      </h2>
      <ul className="vads-u-margin-y--0">
        <li>
          Please visit the <a href="https://www.va.gov/ogc/">OGC Website</a>{' '}
          which has fact sheets and FAQs. Other accreditation questions and
          comments may be sent to the Accreditation Mailbox at{' '}
          <a href="mailto:ogcaccreditationmailbox@va.gov">
            ogcaccreditationmailbox@va.gov
          </a>
          .
        </li>
      </ul>

      <h3 className="vads-u-margin-top--7 vads-u-border-bottom--2px vads-u-border-color--primary">
        Need help?
      </h3>
      <p className="vads-u-margin-bottom--7 vads-u-margin-top--1">
        For questions about the accreditation process, visit the{' '}
        <a href="https://www.va.gov/ogc/">OGC Website</a>.
      </p>
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
        middle: PropTypes.string,
        suffix: PropTypes.string,
      }),
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      hasAttemptedSubmit: PropTypes.bool,
      id: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
      ]),
      response: PropTypes.shape({
        pdfUrl: PropTypes.string,
      }),
      status: PropTypes.string,
      timestamp: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);
