import React, { useMemo } from 'react';
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
  yesAction,
  noAction,
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
  const helpText = (
    <div>
      <va-additional-info
        data-testid="help-text"
        uswds
        trigger={t('next-of-kin-explanation')}
      >
        <div>{t('confirm-who-youd-like-to-represent-your-wishes')}</div>
      </va-additional-info>
    </div>
  );
  const additionalInfo = (
    <div className="vads-u-margin-top--3 vads-u-margin-bottom--3">
      <va-additional-info
        data-testid="additional-info"
        uswds
        trigger={t('how-to-update-next-of-kin')}
      >
        <div>
          <Trans
            i18nKey={t(
              `if-this-is-not-your-correct-information-a-staff-member-can-help--${app}`,
            )}
            components={[
              <span key="bold" className="vads-u-font-weight--bold" />,
            ]}
          />
        </div>
      </va-additional-info>
    </div>
  );
  return (
    <>
      <ConfirmablePage
        header={header || t('is-this-your-current-next-of-kin-information')}
        eyebrow={eyebrow}
        subtitle={subtitle}
        helpText={helpText}
        additionalInfo={additionalInfo}
        dataFields={nextOfKinFields}
        data={nextOfKin}
        yesAction={yesAction}
        noAction={noAction}
        withBackButton
        pageType="next-of-kin"
        router={router}
      />
    </>
  );
}

NextOfKinDisplay.propTypes = {
  noAction: PropTypes.func.isRequired,
  yesAction: PropTypes.func.isRequired,
  eyebrow: PropTypes.string,
  header: PropTypes.string,
  nextOfKin: PropTypes.object,
  router: PropTypes.object,
  subtitle: PropTypes.string,
};
