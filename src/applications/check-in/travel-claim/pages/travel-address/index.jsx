import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { useUpdateError } from '../../../hooks/useUpdateError';

import { makeSelectVeteranAddress } from '../../../selectors';
import TravelPage from '../../../components/pages/TravelPage';

const TravelAddress = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
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
          i18nKey="if-you-traveled-from-a-different-address-you--helptext--v2"
          components={[
            <span key="bold" className="vads-u-font-weight--bold" />,
          ]}
        />
      ),
      trigger: t('if-you-didnt-travel-from-your-home-address'),
    },
  ];

  const noFunction = () => {
    updateError('cant-file-claim-type');
  };

  return (
    <TravelPage
      header={t('did-you-travel-from-your-home-address')}
      bodyText={bodyText}
      additionalInfoItems={additionalInfoItems}
      pageType="travel-address"
      router={router}
      noFunction={noFunction}
      testID="travel-claim-address-page"
    />
  );
};

TravelAddress.propTypes = {
  router: PropTypes.object,
};

export default TravelAddress;
