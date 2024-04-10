import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';
import { getSubmitterName } from '../helpers';

const content = {
  headlineText: 'You’ve submitted your request for priority processing',
  nextStepsText: (
    <>
      <p>
        We’ll review your request along with the supporting documents you
        provided. And we’ll decide if we can prioritize your request. We’ll
        notify you about our decision by mail.
      </p>
      <p>
        If you are homeless, we’ll try to contact you by phone to get an address
        if one was not provided.
      </p>
    </>
  ),
};
const childContent = (
  <div>
    <h2>Where to mail additional documents</h2>
    <p>
      If you didn’t upload your additional documents to this request, you should
      send your documents by mail as soon as possible. Identify the benefit type
      you are requesting priority processing for, then use the corresponding
      mailing address:
    </p>
    <p>
      <b>Compensation Claims</b>
      <br />
      Department of Veterans Affairs Compensation Intake Center
      <br />
      PO Box 4444
      <br />
      Janesville, WI 53547-4444
    </p>
    <p>
      <b>Pension &amp; Survivors Benefit Claims</b>
      <br />
      Department of Veterans Affairs Pension Intake Center
      <br />
      PO Box 5365
      <br />
      Janesville, WI 53547-5365
    </p>
    <p>
      <b>Board of Veterans’ Appeals</b>
      <br />
      Department of Veterans Affairs Board of Veterans’ Appeals
      <br />
      PO Box 27063
      <br />
      Washington, DC 20038
    </p>
    <p>
      <b>Fiduciary</b>
      <br />
      Department of Veterans Affairs Fiduciary Intake Center
      <br />
      PO Box 5211
      <br />
      Janesville, WI 53547-5211
    </p>
    <h2>Where to find additional support</h2>
    <p>
      If you’re currently homeless or at urgent risk of homelessness, we
      encourage you to call the National Call Center for Homeless Veterans. Call
      them at 877-424-3838 (TTY: 711).
    </p>
  </div>
);

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;
  const submitterFullName = getSubmitterName(form.data);

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitterName={submitterFullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      childContent={childContent}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      preparerType: PropTypes.string.isRequired,
      veteranFullName: {
        first: PropTypes.string.isRequired,
        middle: PropTypes.string,
        last: PropTypes.string.isRequired,
      },
      nonVeteranFullName: {
        first: PropTypes.string.isRequired,
        middle: PropTypes.string,
        last: PropTypes.string.isRequired,
      },
      thirdPartyFullName: {
        first: PropTypes.string.isRequired,
        last: PropTypes.string.isRequired,
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
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
