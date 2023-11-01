import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function EmergencyContactDisplay({
  emergencyContact = {},
  eyebrow = '',
  yesAction,
  noAction,
  router,
}) {
  const { t } = useTranslation();
  const dataFields = [
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
  return (
    <>
      <ConfirmablePage
        header={t('is-this-your-current-emergency-contact')}
        eyebrow={eyebrow}
        dataFields={dataFields}
        data={emergencyContact}
        yesAction={yesAction}
        noAction={noAction}
        withBackButton
        pageType="emergency-contact"
        router={router}
      />
    </>
  );
}

EmergencyContactDisplay.propTypes = {
  noAction: PropTypes.func.isRequired,
  yesAction: PropTypes.func.isRequired,
  emergencyContact: PropTypes.object,
  eyebrow: PropTypes.string,
  router: PropTypes.object,
};
