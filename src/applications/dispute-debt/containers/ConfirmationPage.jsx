import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  ConfirmationView,
  ChapterSectionCollection,
} from 'platform/forms-system/src/js/components/ConfirmationView';
import NeedHelp from '../components/NeedHelp';

export const ConfirmationPage = ({ route }) => {
  const { formConfig } = route;

  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const { response, timestamp } = submission || {};

  // no confirmation number is returned from the API currently
  const { confirmationNumber = '' } = response || {};

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
    >
      <ConfirmationView.SubmissionAlert
        title="Your dispute submission is in progress"
        content="You will receive a letter in the email confirming receipt within 60 days."
        actions={null}
      />
      {/* <ConfirmationView.SavePdfDownload /> */}
      <ChapterSectionCollection
        formConfig={trimmedConfig}
        header="Information you submitted on this dispute"
      />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header="We’ll confirm when we receive your dispute request"
        item1Content="After we receive your submission, we’ll review your dispute. You’ll receive a letter in the email confirming receipt within 60 days."
        item1Actions={null}
        item2Header="We’ll review your dispute"
        item2Content="A determination will be made within 180 days. We will mail you a letter with our decision."
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
