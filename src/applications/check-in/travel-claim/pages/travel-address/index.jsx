import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import { makeSelectVeteranAddress } from '../../../selectors';
import TravelPage from '../../../components/pages/TravelPage';

const TravelAddress = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectVeteranAddress = useMemo(makeSelectVeteranAddress, []);
  const address = useSelector(selectVeteranAddress);

  const bodyText = (
    <>
      <p>{t('answer-yes-if-you-traveled-from-the-address')}</p>
      <div className="vads-u-font-weight--bold vads-u-border-top--1px vads-u-padding-top--2 vads-u-margin-top--4 vads-u-border-color--gray-light vads-u-font-family--sans vads-u-border-bottom--1px vads-u-padding-bottom--2">
        {t('home-address')}
        <div className="vads-u-font-weight--normal">{address}</div>
      </div>
    </>
  );

  const additionalInfoItems = [
    {
      info: (
        <Trans
          i18nKey="if-you-traveled-from-a-different-address--helptext"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
          ]}
        />
      ),
      trigger: t('if-you-didnt-travel-from-your-home-address'),
    },
  ];

  return (
    <TravelPage
      header={t('did-you-travel-from-your-home-address')}
      eyebrow={t('check-in')}
      bodyText={bodyText}
      additionalInfoItems={additionalInfoItems}
      pageType="travel-address"
      router={router}
    />
  );
};

TravelAddress.propTypes = {
  router: PropTypes.object,
};

export default TravelAddress;
