import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { URLS } from '../utils/navigation';

const MedicationReviewBlock = ({ page }) => {
  const { t } = useTranslation();
  return (
    <div
      className={
        page === URLS.COMPLETE
          ? 'vads-u-margin-bottom--4'
          : 'vads-u-margin-bottom--1'
      }
      data-testid="medication-review-container"
    >
      <h2
        data-testid="medication-review-header"
        className={page === URLS.DETAILS ? 'vads-u-font-size--sm' : ''}
      >
        {t('prepare-for-your-appointment')}
      </h2>
      <ul>
        <li>{t('bring-your-insurance-cards-with-you')}</li>
        <li>{t('bring-a-list-of-all-your-medications')}</li>
      </ul>
      <va-additional-info
        data-testid="medication-review-what-to-share"
        uswds
        trigger={t('what-to-share-with-your-provider')}
      >
        <div>
          <p>{t('what-to-share-with-your-provider')}</p>
          <ul>
            <li>{t('share-all-medications-your-taking-now')}</li>
            <li>{t('prescriptions-from-va-and-non-va')}</li>
            <li>{t('over-the-counter-medications')}</li>
            <li>{t('vitamins-supplements-and-herbal-remedies')}</li>
          </ul>
          <p>{t('share-anything-that-might-help-your-provider')}</p>
          <ul>
            <li>{t('changes-in-the-medications-youre-taking')}</li>
            <li>{t('changes-in-how-your-medications-affect-you')}</li>
            <li>{t('any-allergies-or-reactions-youve-had')}</li>
            <li>{t('any-health-care-youre-receiving-from-other')}</li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  );
};

MedicationReviewBlock.propTypes = {
  page: PropTypes.string.isRequired,
};

export default MedicationReviewBlock;
