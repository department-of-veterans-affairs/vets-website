import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PhoneNumber() {
  const { t } = useTranslation();
  return <div>{t('phone-number')}</div>;
}
