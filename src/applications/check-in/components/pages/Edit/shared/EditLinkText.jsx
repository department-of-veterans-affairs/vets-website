import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function EditLinkText(props) {
  const { value } = props;
  const { t } = useTranslation();
  return <>{value ? t('edit') : t('add')}</>;
}

EditLinkText.propTypes = {
  value: PropTypes.string,
};
