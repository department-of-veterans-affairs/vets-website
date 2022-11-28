import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function DemographicsDisplay({
  header = '',
  subtitle = '',
  demographics = {},
  yesAction = () => {},
  noAction = () => {},
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
        subtitle={subtitle}
        dataFields={demographicFields}
        data={demographics}
        yesAction={yesAction}
        noAction={noAction}
        pageType="demographic-information"
      />
    </>
  );
}

DemographicsDisplay.propTypes = {
  demographics: PropTypes.object,
  header: PropTypes.string,
  noAction: PropTypes.func,
  subtitle: PropTypes.string,
  yesAction: PropTypes.func,
};
