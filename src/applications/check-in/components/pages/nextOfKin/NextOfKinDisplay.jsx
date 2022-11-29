import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import propTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function NextOfKinDisplay({
  header = '',
  subtitle = '',
  nextOfKin = {},
  yesAction = () => {},
  noAction = () => {},
}) {
  const { t } = useTranslation();
  const nextOfKinFields = [
    {
      title: t('name'),
      key: 'name',
    },
    {
      title: t('relationship'),
      key: 'relationship',
    },
    {
      title: t('address'),
      key: 'address',
    },
    {
      title: t('phone'),
      key: 'phone',
    },
    {
      title: t('work-phone'),
      key: 'workPhone',
    },
  ];
  const loadingMessage = useCallback(
    () => {
      return (
        <div>
          <va-loading-indicator
            data-testid="loading-message"
            message={t('saving-your-responses')}
          />
        </div>
      );
    },
    [t],
  );
  return (
    <>
      <ConfirmablePage
        header={header || t('is-this-your-current-next-of-kin-information')}
        subtitle={subtitle}
        dataFields={nextOfKinFields}
        data={nextOfKin}
        yesAction={yesAction}
        noAction={noAction}
        loadingMessageOverride={loadingMessage}
        withBackButton
        pageType="next-of-kin"
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  header: propTypes.string,
  nextOfKin: propTypes.object,
  noAction: propTypes.func,
  subtitle: propTypes.string,
  yesAction: propTypes.func,
};
