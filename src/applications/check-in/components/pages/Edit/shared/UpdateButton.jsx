import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export default function UpdateButton(props) {
  const { jumpToPage, backPage, clearData, handleUpdate, isUpdatable } = props;
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
      Update
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
