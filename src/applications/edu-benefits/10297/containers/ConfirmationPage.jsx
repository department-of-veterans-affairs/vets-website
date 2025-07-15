import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
} from '../helpers';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission;
  const submitDate = submission?.timestamp || '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
    >
      <ConfirmationView.SubmissionAlert
        title="You’ve submitted your application for the High Technology Program"
        content={<ConfirmationSubmissionAlert />}
        actions=""
      />
      <ConfirmationPrintThisPage data={form.data} submitDate={submitDate} />
      <ConfirmationWhatsNextProcessList />
      <ConfirmationGoBackLink />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
