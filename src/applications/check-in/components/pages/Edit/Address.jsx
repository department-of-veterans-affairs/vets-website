import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Address() {
  const { t } = useTranslation();
  return <div>{t('address')}</div>;
}
