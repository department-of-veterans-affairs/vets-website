import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();

  const helpText = (
    <Trans
      i18nKey="you-can-also-file-a-claim-online--help-text"
      components={[<span key="bold" className="vads-u-font-weight--bold" />]}
    />
  );

  return (
    <TravelPage
      header={t('would-you-like-to-file-a-travel-reimbursement-claim-now')}
      bodyText={
        <p>
          {t(
            'answer-a-few-questions-to-find-out-if-you-can-file-your-claim-now',
          )}
        </p>
      }
      helpText={helpText}
      pageType="travel-question"
      router={router}
    />
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
