import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  ConfirmationGoBackLink,
  ConfirmationHowToContact,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
} from '../helpers';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission;
  const submitDate = submission?.timestamp || '';
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission?.response?.pdfUrl}
    >
      <ConfirmationView.SubmissionAlert
        actions={null}
        content={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <ConfirmationSubmissionAlert
            confirmationNumber={confirmationNumber}
          />
        }
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationWhatsNextProcessList />
      <ConfirmationView.HowToContact content={<ConfirmationHowToContact />} />
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
