import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ConfirmablePage from '../ConfirmablePage';

export default function EmergencyContactDisplay({
  emergencyContact = {},
  yesAction = () => {},
  noAction = () => {},
  isLoading,
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
        dataFields={dataFields}
        data={emergencyContact}
        yesAction={yesAction}
        noAction={noAction}
        isLoading={isLoading}
        withBackButton
        pageType="emergency-contact"
      />
    </>
  );
}

EmergencyContactDisplay.propTypes = {
  emergencyContact: PropTypes.object,
  isLoading: PropTypes.bool,
  noAction: PropTypes.func,
  yesAction: PropTypes.func,
};
