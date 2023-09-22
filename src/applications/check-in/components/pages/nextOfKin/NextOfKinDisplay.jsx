import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';
import { makeSelectApp } from '../../../selectors';

export default function NextOfKinDisplay({
  header = '',
  eyebrow = '',
  subtitle = '',
  nextOfKin = {},
  yesAction = () => {},
  noAction = () => {},
  router,
}) {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

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
  const additionalInfo = (
    <div
      data-testid="additional-info"
      className="vads-u-margin-top--3 vads-u-margin-bottom--3"
    >
      <va-additional-info uswds trigger={t('how-to-update-next-of-kin')}>
        <div>
          <p className="vads-u-margin-top--0">
            {t('confirm-who-youd-like-to-represent-your-wishes')}
          </p>
          <p className="vads-u-margin-bottom--0">
            <Trans
              i18nKey={t(
                `if-this-isnt-your-correct-information-a-staff-member-can-help--${app}`,
              )}
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </p>
        </div>
      </va-additional-info>
    </div>
  );
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
        additionalInfo={additionalInfo}
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
