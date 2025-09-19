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
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';
  const agreementType =
    form.data.agreementType === 'newCommitment'
      ? 'new commitment'
      : 'withdrawal of commitment';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
    >
      <ConfirmationView.SubmissionAlert
        title={`You've submitted your ${agreementType} to the Principles of Excellence for educational institutions`}
        content={<ConfirmationSubmissionAlert />}
        actions={null}
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
