import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  VaLink,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const ConfirmationPage = props => {
  const { route } = props;
  const form = props;
  const { submission } = form;
  const submitDate = new Date(submission?.timestamp);
  const confirmationNumber = submission?.response?.confirmationNumber;

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={route}
      pdfUrl={submission?.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <div className="confirmation-whats-next-process-list-section">
        <h2 className="vads-u-font-size--h3">What to expect next</h2>
        <p>It will take about 60 days to process your application.</p>
        <p>
          If we have any questions or need additional information, we’ll contact
          you.
        </p>
      </div>
      <div>
        <h2 className="vads-u-font-size--h3">
          How to contact us about your application
        </h2>
        <p>
          If you have any questions about your form, you can call us at{' '}
          <VaTelephone contact="800-733-8387" /> (TTY: 711). We’re here Monday
          through Friday, 8:05 a.m. to 7:30 p.m. ET.
        </p>
        <p>You can also contact us online through our Ask VA tool.</p>
        <VaLink text="Go to Ask VA" href="https://ask.va.gov/" />
        <br />
        <br />
      </div>
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string.isRequired,
        middle: PropTypes.string,
        last: PropTypes.string.isRequired,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({
        attributes: PropTypes.shape({
          confirmationNumber: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      timestamp: PropTypes.string.isRequired,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
