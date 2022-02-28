import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export default function CancelButton(props) {
  const { jumpToPage, backPage, clearData } = props;
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
      Cancel
    </button>
  );
}

CancelButton.propTypes = {
  backPage: PropTypes.string,
  clearData: PropTypes.func,
  jumpToPage: PropTypes.func,
};
