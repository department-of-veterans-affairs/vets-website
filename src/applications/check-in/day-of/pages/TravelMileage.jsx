import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TravelPage from '../../components/pages/TravelPage';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();

  return (
    <TravelPage
      header={t('are-you-claiming-only-mileage-for-your-trip')}
      bodyText={
        <p>
          {t(
            'answer-yes-if-you-dont-need-to-submit-any-receipts-for-tolls-meals-lodging-or-other-expenses',
          )}
        </p>
      }
      helpText={t(
        'if-you-do-need-to-submit-receipts-for-other-expenses--helptext',
      )}
      pageType="travel-mileage"
      router={router}
    />
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;
