import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function CancelButton(props) {
  const { jumpToPage, backPage, clearData } = props;
  const { t } = useTranslation();
  const onClick = useCallback(
    () => {
      clearData();
      jumpToPage(backPage);
    },
    [backPage, jumpToPage, clearData],
  );
  return (
    <button
      onClick={onClick}
      className="usa-button-secondary usa-button-big"
      data-testid="cancel-button"
      type="button"
    >
      {t('cancel')}
    </button>
  );
}

CancelButton.propTypes = {
  backPage: PropTypes.string,
  clearData: PropTypes.func,
  jumpToPage: PropTypes.func,
};
