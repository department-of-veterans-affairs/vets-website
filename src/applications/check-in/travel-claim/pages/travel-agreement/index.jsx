import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Wrapper from '../../../components/layout/Wrapper';
import BackButton from '../../../components/BackButton';
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
        pageTitle="Travel Agreement"
        classNames="travel-page"
        withBackButton
      >
        <ul data-testid="agreement-list-items">
          <li>{t('i-have-incurred-a-cost-in-relation')}</li>
          <li>
            {t('i-have-neither-obtained-transportion-at-government-expense')}
          </li>
          <li>{t('i-have-not-received-other-transportion-resources')}</li>
          <li>{t('i-am-the-only-person-claiming-for-the-travel-listed')}</li>
          <li>{t('i-have-not-previously-received-payment')}</li>
        </ul>
        <Link
          onClick={goToPreviousPage}
          to={URLS.TRAVEL_REVIEW}
          data-testid="file-claim-link"
          className="vad-u-font-weight-bold"
        >
          <i aria-hidden="true" className="vads-u-font-weight-bold" />
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
