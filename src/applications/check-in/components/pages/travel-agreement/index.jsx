import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Wrapper from '../../layout/Wrapper';
import BackButton from '../../BackButton';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { URLS } from '../../../utils/navigation';

const TravelAgreement = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToPreviousPage } = useFormRouting(router);

  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        prevUrl="#back"
        text={t('back-to-last-screen')}
      />
      <Wrapper
        pageTitle={t('beneficiary-travel-agreement')}
        classNames="travel-page"
        withBackButton
      >
        <ul data-testid="agreement-list-items">
          <Trans
            i18nKey="certify-statements"
            components={[<li key="list-item" />]}
          />
        </ul>
        <p>{t('review-your-claim-information-now-to-file')}</p>
        <Link
          onClick={goToPreviousPage}
          to={URLS.TRAVEL_REVIEW}
          data-testid="file-claim-link"
          className="vads-u-font-weight--bold"
        >
          {t('finish-reviewing-your-travel-claim')}
        </Link>
      </Wrapper>
    </>
  );
};

TravelAgreement.propTypes = {
  router: PropTypes.object,
};

export default TravelAgreement;
