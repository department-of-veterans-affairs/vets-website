import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function UpdateButton(props) {
  const { jumpToPage, backPage, clearData, handleUpdate, isUpdatable } = props;
  const { t } = useTranslation();
  const onClick = useCallback(
    () => {
      handleUpdate();
      clearData();
      jumpToPage(backPage);
    },
    [handleUpdate, clearData, jumpToPage, backPage],
  );
  return (
    <button
      onClick={onClick}
      className="usa-button usa-button-big"
      data-testid="update-button"
      type="button"
      disabled={!isUpdatable}
    >
      {t('update')}
    </button>
  );
}

UpdateButton.propTypes = {
  backPage: PropTypes.string,
  clearData: PropTypes.func,
  handleUpdate: PropTypes.func,
  isUpdatable: PropTypes.bool,
  jumpToPage: PropTypes.func,
};
