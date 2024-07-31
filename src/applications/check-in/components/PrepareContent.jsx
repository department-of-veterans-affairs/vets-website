import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { useFormRouting } from '../hooks/useFormRouting';

const PrepareContent = props => {
  const { smallHeading, router } = props;
  const { jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isMedicationReviewContentEnabled } = useSelector(
    selectFeatureToggles,
  );

  const onPrepareClick = useCallback(
    e => {
      e.preventDefault();
      jumpToPage('what-to-bring-to-va-health-care-appointments');
    },
    [jumpToPage],
  );
  if (isMedicationReviewContentEnabled) {
    return (
      <div data-testid="prepare-content">
        <h2
          className={
            smallHeading ? 'vads-u-font-size--sm' : 'vads-u-margin-top--0'
          }
        >
          {t('prepare-for-your-appointment')}
        </h2>
        <p>{t('bring-insurance-cards-list-medications-other')}</p>
        <p className="vads-u-margin-bottom--4">
          <a
            href={`${
              router.location.basename
            }/what-to-bring-to-va-health-care-appointments/`}
            hrefLang="en"
            onClick={onPrepareClick}
          >
            {t('find-out-what-to-bring')}
          </a>
        </p>
      </div>
    );
  }
  return <></>;
};

PrepareContent.propTypes = {
  router: PropTypes.object.isRequired,
  smallHeading: PropTypes.bool,
};

export default PrepareContent;
