import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelEligibilityAdditionalInfo from '../../components/TravelEligibilityAdditionalInfo';
import TravelPage from '../../components/pages/TravelPage';
import ExternalLink from '../../components/ExternalLink';

const TravelQuestion = props => {
  const { router } = props;
  const { t } = useTranslation();

  const body = (
    <>
      <p>{t('well-ask-additional-questions')}</p>
      <div className="vads-u-margin-bottom--2">
        <va-additional-info
          uswds
          trigger={t('how-to-file-other-types-of-claims')}
        >
          <>
            <p>{t('you-can-only-use-this-tool-to-file-claims-for-todays')}</p>
            <br />
            <p>{t('youll-need-to-use-a-different-option-to-file')}</p>
            <br />
            <ul>
              <li>{t('claims-for-past-va-appointments')}</li>
              <li>{t('claims-for-community-care-appointments')}</li>
              <li>{t('claims-for-other-expenses')}</li>
            </ul>
            <br />
            <ExternalLink
              href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
              hrefLang="en"
            >
              {t('learn-how-to-file-other-types-of-claims')}
            </ExternalLink>
          </>
        </va-additional-info>
      </div>
      <p>{t('we-encourage-you-to-review-the-requirements')}</p>
      <div className="vads-u-margin-bottom--2">
        <va-additional-info
          uswds
          trigger={t('travel-reimbursement-eligibility')}
        >
          <TravelEligibilityAdditionalInfo />
        </va-additional-info>
      </div>
    </>
  );
  return (
    <TravelPage
      header={t('would-you-like-to-file-a-travel-reimbursement-claim-now')}
      eyebrow={t('check-in')}
      bodyText={body}
      pageType="travel-question"
      router={router}
    />
  );
};

TravelQuestion.propTypes = {
  router: PropTypes.object,
};

export default TravelQuestion;
