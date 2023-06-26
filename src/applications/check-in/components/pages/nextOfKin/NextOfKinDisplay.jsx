import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function NextOfKinDisplay({
  header = '',
  eyebrow = '',
  subtitle = '',
  nextOfKin = {},
  yesAction = () => {},
  noAction = () => {},
  router,
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
        eyebrow={eyebrow}
        subtitle={subtitle}
        dataFields={nextOfKinFields}
        data={nextOfKin}
        yesAction={yesAction}
        noAction={noAction}
        loadingMessageOverride={loadingMessage}
        withBackButton
        pageType="next-of-kin"
        router={router}
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  eyebrow: PropTypes.string,
  header: PropTypes.string,
  nextOfKin: PropTypes.object,
  noAction: PropTypes.func,
  router: PropTypes.object,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
};
