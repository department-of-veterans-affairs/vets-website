import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import i18nDebtApp from 'applications/dispute-debt/i18n';
import {
  ConfirmationView,
  ChapterSectionCollection,
} from 'platform/forms-system/src/js/components/ConfirmationView';
import { Trans } from 'react-i18next';
import { setDocumentTitle } from '../utils';

import NeedHelp from '../components/NeedHelp';

export const ConfirmationPage = ({ route }) => {
  const { formConfig } = route;

  useEffect(
    () => {
      setDocumentTitle('Confirmation Page - Dispute Debt');
    },
    [formConfig.title],
  );

  const form = useSelector(state => state.form || {});
  const userEmail = useSelector(state => state.user.profile.email || '');

  const { submission } = form;
  const { response, timestamp } = submission || {};

  // Keeping it here, but not currently using it from DMC pdfs, due to order of PDF creation and API response
  const confirmationNumber = response?.apiResponse?.submissionId || '';

  // Dropping reason chapter to better match designs and avoid extra repeating noise
  const trimmedConfig = {
    ...formConfig,
    chapters: {
      personalInformationChapter: {
        ...formConfig.chapters.personalInformationChapter,
      },
      debtSelectionChapter: {
        ...formConfig.chapters.debtSelectionChapter,
      },
    },
  };

  return (
    <ConfirmationView
      confirmationNumber={confirmationNumber}
      formConfig={formConfig}
      submitDate={timestamp || ''}
      pdfUrl={submission.response?.pdfUrl}
      filename="VA-Dispute-Debt-Submission.pdf"
    >
      <ConfirmationView.SubmissionAlert
        title={i18nDebtApp.t('dispute-submission-alert.title')}
        content={
          <Trans
            i18nKey="dispute-submission-alert.description"
            values={{ email: userEmail }}
            components={{ bold: <strong /> }}
          />
        }
        actions={null}
      />
      <ConfirmationView.SavePdfDownload />
      <ChapterSectionCollection
        formConfig={trimmedConfig}
        header="Information you submitted on this dispute"
      />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header={i18nDebtApp.t(
          'dispute-submitted-whats-next.first-action.header',
        )}
        item1Content={i18nDebtApp.t(
          'dispute-submitted-whats-next.first-action.description',
        )}
        item1Actions={null}
        item2Header={i18nDebtApp.t(
          'dispute-submitted-whats-next.second-action.header',
        )}
        item2Content={i18nDebtApp.t(
          'dispute-submitted-whats-next.second-action.description',
        )}
      />
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp content={<NeedHelp />} />
    </ConfirmationView>
  );
};

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
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
