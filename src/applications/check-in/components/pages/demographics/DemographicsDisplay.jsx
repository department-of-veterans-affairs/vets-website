import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function DemographicsDisplay({
  header = '',
  eyebrow = '',
  subtitle = '',
  demographics = {},
  yesAction,
  noAction,
  router,
}) {
  const { t } = useTranslation();

  const demographicFields = [
    {
      title: t('mailing-address'),
      key: 'mailingAddress',
    },
    {
      title: t('home-address'),
      key: 'homeAddress',
    },
    {
      title: t('home-phone'),
      key: 'homePhone',
    },
    {
      title: t('mobile-phone'),
      key: 'mobilePhone',
    },
    {
      title: t('work-phone'),
      key: 'workPhone',
    },
    {
      title: t('email-address'),
      key: 'emailAddress',
    },
  ];
  return (
    <>
      <ConfirmablePage
        header={header || t('is-this-your-current-contact-information')}
        eyebrow={eyebrow}
        subtitle={subtitle}
        dataFields={demographicFields}
        data={demographics}
        yesAction={yesAction}
        noAction={noAction}
        pageType="demographic-information"
        router={router}
      />
    </>
  );
}

DemographicsDisplay.propTypes = {
  noAction: PropTypes.func.isRequired,
  yesAction: PropTypes.func.isRequired,
  demographics: PropTypes.object,
  eyebrow: PropTypes.string,
  header: PropTypes.string,
  router: PropTypes.object,
  subtitle: PropTypes.string,
};
